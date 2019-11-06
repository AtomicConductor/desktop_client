/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eslIgnore_" }]*/

import { createSelector } from "reselect";
import * as Sqrl from "squirrelly";
import Sequence from "../_helpers/sequence";

import path from "upath";

const instanceTypesMapSelector = state => state.entities.instanceTypes;
const assetsMap = state => state.submitter.submission.assets;
const taskTemplate = state => state.submitter.submission.taskTemplate;
const chunkSize = state => state.submitter.submission.chunkSize;
const frameSpec = state => state.submitter.submission.frameSpec;
const softwarePackages = state => state.submitter.submission.softwarePackages;
const instanceType = state => state.submitter.submission.instanceType;

const jobTitle = state => state.submitter.submission.jobTitle;
const outputPath = state => state.submitter.submission.outputPath;
const project = state => state.submitter.submission.project;

const preemptible = state => state.submitter.submission.preemptible;
const retries = state => state.submitter.submission.retries;

const uploadOnly = state => state.submitter.submission.uploadOnly;
const force = state => state.submitter.submission.force;
const localUpload = state => state.submitter.submission.localUpload;

const environmentOverrides = state =>
  state.submitter.submission.environmentOverrides.filter(
    _ => !(_.key.trim() === "" && _.value.trim() === "")
  );

const tileSpec = state =>
  state.submitter.submission.useTiles
    ? state.submitter.submission.tileSpec
    : "1";

const templateIncludesStep = state =>
  state.submitter.submission.taskTemplate.includes("<chunk_step>");

const scoutFrameSpec = state =>
  state.submitter.submission.useScoutFrames
    ? state.submitter.submission.scoutFrameSpec
    : "";

const projectsSelector = state =>
  state.entities.projects
    .concat()
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

const _packageIsValid = _ => _.package && Object.keys(_.package).length;

const instanceTypesSelector = createSelector(
  instanceTypesMapSelector,
  instanceTypesMap =>
    Object.keys(instanceTypesMap)
      .map(_ => instanceTypesMap[_])
      .sort((a, b) => (a.cores < b.cores ? -1 : 1))
);

const assetsSelector = createSelector(
  assetsMap,
  assetsMap =>
    Object.keys(assetsMap).map(_ => ({
      path: _,
      size: assetsMap[_].size,
      type: assetsMap[_].type
    }))
);

/**
 * Validator selectors (or helpers) should return an array of errors.
 * If the array is empty, then the input is valid.
 */
const _specValidator = spec => {
  try {
    Sequence(spec);
    return [];
  } catch (e) {
    return [e.message];
  }
};

const assetsValidator = createSelector(
  assetsMap,
  assetsMap =>
    Object.keys(assetsMap)
      .filter(_ => !path.isAbsolute(_))
      .map(_ => `${_} is not an absolute path`)
);

const taskTemplateValidator = createSelector(
  taskTemplate,
  template =>
    template && template.trim() !== "" ? [] : ["Invalid task template"]
);

const progressionsValidator = createSelector(
  templateIncludesStep,
  frameSpec,
  chunkSize,
  (templateIncludesStep, frameSpec, chunkSize) => {
    if (!templateIncludesStep) {
      return [];
    }

    const errors = [];
    for (let eslIgnore_chunk of Sequence(frameSpec).getChunks(chunkSize)) {
      if (!eslIgnore_chunk.isProgression()) {
        errors.push(`${eslIgnore_chunk} is not a progression.`);
      }
    }
    if (errors.length) {
      errors.push(
        "If you want to use the <chunk_step> token, try turning on 'force-progressions'"
      );
    }
    return errors;
  }
);

const taskDataValidator = createSelector(
  progressionsValidator,
  taskTemplateValidator,
  frameSpec,
  tileSpec,
  (progressionsValidator, taskTemplateValidator, frameSpec, tileSpec) => [
    ..._specValidator(frameSpec),
    ..._specValidator(tileSpec),
    ...taskTemplateValidator,
    ...progressionsValidator
  ]
);

/***
 * The Selectors below create the top level fields for the submission.
 * They should contain either:
 * 1. The computed value - e.g. object, string, number, array
 * OR
 * 2. An object with the key "errors" which points to an array of messages.
 *
 *
 */

const instanceTypeNameSelector = createSelector(
  instanceType,
  _ =>
    _.name && _.name.trim() !== ""
      ? _.name
      : { errors: [`Invalid instance type`] }
);

const jobTitleSelector = createSelector(
  jobTitle,
  _ => (_ && _.trim() !== "" ? _ : { errors: [`Invalid job title`] })
);

const projectSelector = createSelector(
  project,
  _ => (_ && _.trim() !== "" ? _ : { errors: ["Invalid project"] })
);

const outputPathSelector = createSelector(
  outputPath,
  _ => (path.isAbsolute(_) ? _ : { errors: [`${_} is not an absolute path`] })
);

const assetFilenamesSelector = createSelector(
  assetsMap,
  assetsValidator,
  (assetsMap, assetsValidator) => {
    const errors = assetsValidator;
    if (errors.length) {
      return { errors };
    }
    return Object.keys(assetsMap).sort();
  }
);

const taskDataSelector = createSelector(
  taskDataValidator,
  taskTemplate,
  frameSpec,
  tileSpec,
  chunkSize,
  (taskDataValidator, taskTemplate, frameSpec, tileSpec, chunkSize) => {
    const errors = taskDataValidator;
    if (errors.length) {
      return { errors };
    }
    Sqrl.defaultTags(["<", ">"]);
    const mainSequence = Sequence(frameSpec);
    const tilesSequence = Sequence(tileSpec);

    const sequence_context = {
      sequence_start: mainSequence.first,
      sequence_end: mainSequence.last,
      sequence_step: mainSequence.step,
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
          chunk_step: eslIgnore_chunk.step,
          chunk_spec: eslIgnore_chunk.spec
        };
        if (
          !eslIgnore_chunk.isProgression &&
          taskTemplate.includes("<chunk_step>")
        ) {
        }
        result.push({
          command: Sqrl.Render(taskTemplate, context),
          frames: Sqrl.Render("<chunk_spec>", context)
        });
      }
    }
    return result;
  }
);

const retryPolicySelector = createSelector(
  preemptible,
  retries,
  (preemptible, retries) =>
    preemptible ? { preempted: { max_retries: Math.trunc(retries) } } : null
);

const scoutFramesSelector = createSelector(
  scoutFrameSpec,
  scoutFrameSpec => {
    const errors = _specValidator(scoutFrameSpec);
    return errors.length
      ? { errors }
      : [...Sequence(scoutFrameSpec).getFrames()].join(",");
  }
);

const softwarePackageIdsSelector = createSelector(
  softwarePackages,
  softwarePackages => [
    ...new Set(softwarePackages.filter(_packageIsValid).map(_ => _.package.id))
  ]
);

const softwareEnvironmentSelector = createSelector(
  softwarePackages,
  packages =>
    packages
      .filter(_packageIsValid)
      .reduce((env, { package: { environment } }) => {
        return environment.reduce((acc, { merge_policy, name, value }) => {
          if (merge_policy === "exclusive") env[name] = value;
          if (merge_policy === "append") {
            env[name] = env[name] ? `${env[name]}:${value}` : value;
          }
          return acc;
        }, env);
      }, {})
);

const environmentOverridesSelector = createSelector(
  environmentOverrides,
  environmentOverrides =>
    environmentOverrides.reduce((acc, _) => ({ ...acc, [_.key]: _.value }), {})
);

const environmentSelector = createSelector(
  softwareEnvironmentSelector,
  environmentOverridesSelector,
  (softwareEnvironmentSelector, environmentOverridesSelector) => {
    const combinedEnv = {
      ...softwareEnvironmentSelector,
      ...environmentOverridesSelector
    };

    return Object.keys(combinedEnv)
      .filter(key => combinedEnv[key].trim() !== "")
      .reduce((obj, key) => {
        obj[key] = combinedEnv[key];
        return obj;
      }, {});
  }
);

const submissionSelector = createSelector(
  taskDataSelector,
  scoutFramesSelector,
  assetFilenamesSelector,
  environmentSelector,
  retryPolicySelector,
  uploadOnly,
  force,
  localUpload,
  jobTitleSelector,
  projectSelector,
  outputPathSelector,
  instanceTypeNameSelector,
  (
    taskDataSelector,
    scoutFramesSelector,
    assetFilenamesSelector,
    environmentSelector,
    retryPolicySelector,
    uploadOnly,
    force,
    localUpload,
    jobTitleSelector,
    projectSelector,
    outputPathSelector,
    instanceTypeNameSelector
  ) => {
    return {
      jobTitle: jobTitleSelector,
      instance_type: instanceTypeNameSelector,
      tasks_data: taskDataSelector,
      upload_paths: assetFilenamesSelector,
      environment: environmentSelector,
      scout_frames: scoutFramesSelector,
      autoretry_policy: retryPolicySelector,
      upload_only: uploadOnly,
      force,
      local_upload: localUpload,
      project: projectSelector,
      output_path: outputPathSelector
    };
  }
);

const submissionValidSelector = createSelector(
  submissionSelector,
  submission =>
    !Object.keys(submission).some(
      _ =>
        typeof submission[_] === "object" &&
        submission[_] !== null &&
        submission[_].hasOwnProperty("errors")
    )
);

export {
  instanceTypesSelector,
  instanceTypesMapSelector,
  projectsSelector,
  scoutFramesSelector,
  taskDataSelector,
  assetFilenamesSelector,
  assetsSelector,
  softwarePackageIdsSelector,
  environmentSelector,
  instanceTypeNameSelector,
  jobTitleSelector,
  projectSelector,
  outputPathSelector,
  submissionValidSelector,
  submissionSelector
};
