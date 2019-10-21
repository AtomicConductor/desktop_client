import * as Sqrl from "squirrelly";
import { toSpec } from "./sequence";

// TODO - Find a better Regex.
const FRAME_SPEC_REGEX = /^(?<starta>\d+)$|(?:^(?<startb>\d+)-(?<endb>\d+)$)|(?:^(?<startc>\d+)-(?<endc>\d+)x(?<byc>\d+)$)/;
const SPLIT_COMMAS_REGEX = /[\s,,]/;

/**
 *
 *
 * @param {number} first
 * @param {number} last inclusive last number in sequence
 * @param {number} [step=1]
 * @returns Array of numbers
 */
const _range = (first, last, step = 1) => {
  if (first > last) {
    let tmp = last;
    last = first;
    first = tmp;
  }
  return Array(Math.ceil((last - first + 1) / step))
    .fill(first)
    .map((x, y) => x + y * step);
};

/**
 *
 *
 * @param {string} frameSpec like "1, 2-5, 7-20x3"
 * @returns Array of sorted unique integers
 */
const _resolveFrames = frameSpec => {
  const result = [];
  frameSpec.split(SPLIT_COMMAS_REGEX).forEach(_ => {
    const match = _.match(FRAME_SPEC_REGEX);

    if (match) {
      if (match.groups.starta) {
        const startAt = parseInt(match.groups.starta);
        result.push(startAt);
      } else if (match.groups.startb) {
        const startAt = parseInt(match.groups.startb);
        const endAt = parseInt(match.groups.endb);
        result.push(..._range(startAt, endAt));
      } else if (match.groups.startc) {
        const startAt = parseInt(match.groups.startc);
        const endAt = parseInt(match.groups.endc);
        const by = parseInt(match.groups.byc);
        result.push(..._range(startAt, endAt, by));
      }
    }
  });
  result.sort((a, b) => a - b);
  return [...new Set(result)];
};

const _resolveChunks = (frameSpec, chunkSize = 1) => {
  const frames = _resolveFrames(frameSpec);

  return Array(Math.ceil(frames.length / chunkSize))
    .fill()
    .map((_, index) => index * chunkSize)
    .map(begin => frames.slice(begin, begin + chunkSize));
};

const _resolveTiles = (frameSpec, chunkSize = 1, tilesSpec = "1") => {
  const chunks = _resolveChunks(frameSpec, chunkSize);
  const tiles = _resolveFrames(tilesSpec);
  return chunks.flatMap(chunk =>
    tiles.map(tile => ({ tile: tile, chunk: chunk }))
  );
};

const resolveTasks = (
  taskTemplate,
  frameSpec,
  chunkSize = 1,
  tileSpec = "1"
) => {
  Sqrl.defaultTags(["<", ">"]);
  const tiles = _resolveTiles(frameSpec, chunkSize, tileSpec);
  return tiles.map(tile => {
    const context = {
      tile: tile.tile,
      chunk_start: tile.chunk[0],
      chunk_end: tile.chunk[tile.chunk.length - 1],
      chunk: toSpec(tile.chunk)
    };
    const command = Sqrl.Render(taskTemplate, context);
    const frames = Sqrl.Render("<chunk>", context);
    return { command, frames };
  });
};

const resolveSubmission = submitter => {
  const {
    taskTemplate,
    frameSpec,
    chunkSize,
    useTiles,
    instanceTypes,
    instanceTypeIndex,
    jobTitle,
    preemptible,
    projectIndex,
    projects
  } = submitter;
  let tileSpec = useTiles ? submitter.tileSpec : "1";
  const tasks_data = resolveTasks(
    taskTemplate,
    frameSpec,
    chunkSize,
    tileSpec,
    useTiles
  );

  const instance_type = instanceTypes[instanceTypeIndex].name;
  const project = projects[projectIndex];
  const job_title = jobTitle;

  return { tasks_data, instance_type, job_title, preemptible, project };
};

export { resolveTasks, resolveSubmission };
