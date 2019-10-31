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

const _validPackage = _ => _.package && Object.keys(_.package).length;

const resolvePackages = softwarePackages => [
  ...new Set(softwarePackages.filter(_validPackage).map(_ => _.package.id))
];

const _resolveSoftwareEnvironment = softwarePackages =>
  softwarePackages
    .filter(_validPackage)
    .reduce((env, { package: { environment } }) => {
      return environment.reduce((acc, { merge_policy, name, value }) => {
        if (merge_policy === "exclusive") env[name] = value;
        if (merge_policy === "append") {
          env[name] = env[name] ? `${env[name]}:${value}` : value;
        }
        return acc;
      }, env);
    }, {});

const _resolveEnvironmentOverrides = overrides =>
  overrides
    .filter(_ => !(_.key.trim() === "" && _.value.trim() === ""))
    .reduce((obj, _) => ({ ...obj, [_.key]: _.value }), {});

const resolveEnvironment = (softwarePackages, environmentOverrides = []) => {
  const combinedEnv = {
    ..._resolveSoftwareEnvironment(softwarePackages, {}),
    ..._resolveEnvironmentOverrides(environmentOverrides)
  };
  return Object.keys(combinedEnv)
    .filter(key => combinedEnv[key].trim() !== "")
    .reduce((obj, key) => {
      obj[key] = combinedEnv[key];
      return obj;
    }, {});
};

const resolveAssets = assets => Object.keys(assets).sort();

const resolveRetryPolicy = (preemptible, retries) =>
  preemptible ? { preempted: { max_retries: parseInt(retries) } } : null;

const resolveScoutFrames = (scoutFrameSpec, useScoutFrames) =>
  useScoutFrames ? _resolveFrames(scoutFrameSpec).join(",") : "";

const resolveSubmission = ({
  taskTemplate,
  frameSpec,
  chunkSize,
  useTiles,
  jobTitle,
  outputPath,
  preemptible,
  retries,
  project,
  instanceType,
  tileSpec,
  scoutFrameSpec,
  useScoutFrames,
  softwarePackages,
  environmentOverrides,
  assets
}) => {
  const tasks_data = resolveTasks(
    taskTemplate,
    frameSpec,
    chunkSize,
    useTiles ? tileSpec : "1"
  );

  const autoretry_policy = resolveRetryPolicy(preemptible, retries);

  const upload_paths = resolveAssets(assets);
  const instance_type = instanceType.name;
  const job_title = jobTitle;
  const output_path = outputPath;
  const software_package_ids = resolvePackages(softwarePackages);

  const environment = resolveEnvironment(
    softwarePackages,
    environmentOverrides
  );

  const upload_only = false;
  const force = false;
  const local_upload = true;
  const priority = 5;

  const scout_frames = resolveScoutFrames(scoutFrameSpec, useScoutFrames);

  return {
    upload_only,
    force,
    local_upload,
    priority,
    scout_frames,
    autoretry_policy,
    output_path,
    instance_type,
    job_title,
    preemptible,
    project,
    software_package_ids,
    environment,
    upload_paths,
    tasks_data
  };
};

export {
  resolveTasks,
  resolveSubmission,
  resolvePackages,
  resolveEnvironment,
  resolveAssets,
  resolveScoutFrames,
  resolveRetryPolicy
};
