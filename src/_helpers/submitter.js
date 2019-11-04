/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eslIgnore_" }]*/

import * as Sqrl from "squirrelly";
import Sequence from "./sequence";

const resolveTasks = (
  taskTemplate,
  frameSpec,
  chunkSize = 1,
  tileSpec = "1"
) => {
  Sqrl.defaultTags(["<", ">"]);
  const mainSequence = Sequence(frameSpec);
  const tilesSequence = Sequence(tileSpec);

  const sequence_context = {
    sequence_start: mainSequence.first,
    sequence_end: mainSequence.last,
    sequence_step: mainSequence.step || "UNDEFINED",
    sequence_spec: mainSequence.spec
  };

  const result = [];

  for (let eslIgnore_chunk of mainSequence.getChunks(chunkSize)) {
    for (let eslIgnore_tile of tilesSequence.getFrames()) {
      const context = {
        ...sequence_context,
        tile: eslIgnore_tile,
        chunk_start: eslIgnore_chunk.first,
        chunk_end: eslIgnore_chunk.last,
        chunk_step: eslIgnore_chunk.step || "UNDEFINED",
        chunk_spec: eslIgnore_chunk.spec
      };
      result.push({
        command: Sqrl.Render(taskTemplate, context),
        frames: Sqrl.Render("<chunk_spec>", context)
      });
    }
  }
  return result;
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
  useScoutFrames ? [...Sequence(scoutFrameSpec).getFrames()].join(",") : "";

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
