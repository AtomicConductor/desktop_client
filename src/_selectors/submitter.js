/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eslIgnore_" }]*/

import { createSelector } from "reselect";
import Sequence from "../_helpers/sequence";
import { compile } from "../_helpers/template";
import { toPosix } from "../_helpers/paths";
import { condenseArray } from "../_helpers/presentation";
import { isAbsolute, toUnix } from "upath";
import { projectsSelector, instanceTypesSelector } from "./entities";
import { packageLocation } from "./settings";

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

const asDir = path => (path.slice(-1) === "/" ? path : `${path}/`);

const environmentOverrides = state =>
  state.submitter.submission.environmentOverrides;

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

const _packageIsValid = _ => _.package && Object.keys(_.package).length;

const assetsSelector = createSelector(assetsMap, assetsMap =>
  Object.keys(assetsMap).map(_ => ({
    path: _,
    size: assetsMap[_].size,
    type: assetsMap[_].type
  }))
);

/**
 * Validator _selectors (or helpers) should return an array of errors.
 * If the array is empty, then the input is valid.
 */
const _specValidator = (spec, prefix) => {
  try {
    Sequence(spec);
    return [];
  } catch (e) {
    return [`${prefix}: ${e.message}`];
  }
};

const assetsValidator = createSelector(assetsMap, assetsMap =>
  Object.keys(assetsMap)
    .filter(_ => !isAbsolute(_))
    .map(_ => `${_} is not an absolute path`)
);

const taskTemplateValidator = createSelector(taskTemplate, template =>
  template && template.trim() !== ""
    ? []
    : ["Invalid task template. Task commands cannot be empty."]
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
    ..._specValidator(frameSpec, "Frames"),
    ..._specValidator(tileSpec, "Tiles"),
    ...taskTemplateValidator,
    ...progressionsValidator
  ]
);

const instanceTypeSelector = createSelector(
  instanceTypesSelector,
  instanceType,
  (instanceTypes, instanceType) =>
    instanceTypes.length
      ? instanceTypes.find(_ => instanceType.name === _.name) ||
        instanceTypes[0]
      : { name: "", description: "" }
);

/***
 * The Selectors below create fields for the submission.
 * They should contain either:
 * 1. The computed value - e.g. object, string, number, array
 * OR
 * 2. An object with the key "errors" which points to an array of messages.
 */

const instanceTypeNameSelector = createSelector(
  instanceTypeSelector,
  _ => _.name || { errors: [`No instance types. Please refresh the list.`] }
);

const jobTitleSelector = createSelector(jobTitle, _ =>
  _ && _.trim() !== "" ? _ : { errors: [`Invalid job title`] }
);

const projectSelector = createSelector(
  project,
  projectsSelector,
  (project, projects) => {
    if (!projects.length) {
      return {
        errors: [
          "No projects. Please refresh or create some projects in the web UI"
        ]
      };
    }
    if (projects.some(_ => project === _)) {
      return project;
    }
    if (projects.some(_ => "default" === _)) {
      return "default";
    }
    return projects[0];
  }
);

const outputPathSelector = createSelector(
  outputPath,
  assetsMap,
  (path, assets) => {
    path = toUnix(path);

    const pathAsDir = asDir(path);
    if (!isAbsolute(pathAsDir)) {
      return { errors: [`${path} is not an absolute path`] };
    }

    for (const asset in assets) {
      const assetAsDir = asDir(toUnix(asset));
      if (assetAsDir.startsWith(pathAsDir)) {
        return {
          errors: [
            `Output path "${path}" cannot contain upload assets: "${asset}".`
          ]
        };
      }
      if (pathAsDir.startsWith(assetAsDir)) {
        return {
          errors: [
            `An asset directory "${assetAsDir}" cannot contain the output path "${path}".`
          ]
        };
      }
    }
    return path;
  }
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
  outputPath,
  (
    taskDataValidator,
    taskTemplate,
    frameSpec,
    tileSpec,
    chunkSize,
    outputPath
  ) => {
    const errors = taskDataValidator;
    if (errors.length) {
      return { errors };
    }
    const mainSequence = Sequence(frameSpec);
    const tilesSequence = Sequence(tileSpec);
    const globalContext = {
      output_path: toPosix(outputPath),
      sequence_step: mainSequence.step,
      sequence_spec: mainSequence.spec,
      sequence_start: mainSequence.first,
      sequence_end: mainSequence.last
    };

    const result = [];

    for (let eslIgnore_chunk of mainSequence.getChunks(chunkSize)) {
      for (let eslIgnore_tile of tilesSequence.getFrames()) {
        const context = {
          ...globalContext,
          chunk_start: eslIgnore_chunk.first,
          chunk_end: eslIgnore_chunk.last,
          tile: eslIgnore_tile,
          chunk_step: eslIgnore_chunk.step,
          chunk_spec: eslIgnore_chunk.spec
        };
        result.push({
          command: compile(taskTemplate)(context),
          frames: compile("<chunk_spec>")(context)
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

const scoutFramesSelector = createSelector(scoutFrameSpec, scoutFrameSpec => {
  const errors = _specValidator(scoutFrameSpec, "Scout frames");
  return errors.length
    ? { errors }
    : [...Sequence(scoutFrameSpec).getFrames()].join(",");
});

const softwarePackageIdsSelector = createSelector(
  softwarePackages,
  softwarePackages => [
    ...new Set(softwarePackages.filter(_packageIsValid).map(_ => _.package.id))
  ]
);

const softwareEnvironmentSelector = createSelector(softwarePackages, packages =>
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
    environmentOverrides
      .filter(_ => !(_.key.trim() === "" && _.value.trim() === ""))
      .reduce((acc, _) => ({ ...acc, [_.key]: _.value }), {})
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
  softwarePackageIdsSelector,
  retryPolicySelector,
  preemptible,
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
    softwarePackageIdsSelector,
    retryPolicySelector,
    preemptible,
    uploadOnly,
    force,
    localUpload,
    jobTitleSelector,
    projectSelector,
    outputPathSelector,
    instanceTypeNameSelector
  ) => {
    return {
      job_title: jobTitleSelector,
      project: projectSelector,
      instance_type: instanceTypeNameSelector,
      software_package_ids: softwarePackageIdsSelector,
      upload_only: uploadOnly,
      force,
      local_upload: localUpload,
      preemptible,
      autoretry_policy: retryPolicySelector,
      output_path: outputPathSelector,
      environment: environmentSelector,
      upload_paths: assetFilenamesSelector,
      scout_frames: scoutFramesSelector,
      tasks_data: taskDataSelector
    };
  }
);

const submissionScriptSelector = createSelector(
  packageLocation,
  packageLocation => {
    let script = "";
    script += "import sys\n";
    script += "import json\n";
    script += "import os\n";

    script += `sys.path.insert(0, "${packageLocation}")\n`;
    script += "from ciocore import conductor_submit\n";
    script += `filename =  "{}.json".format(os.path.splitext(os.path.abspath(__file__))[0])\n`;

    script += "with open(filename) as f:\n";
    script += "   data = json.load(f)\n";

    script += "submission = conductor_submit.Submit(data)\n";
    script += "response, response_code = submission.main()\n";
    script += "print response_code\n";
    script += "print json.dumps(response)\n";

    return script;
  }
);

/** Alert _selectors warn about, but do not block, the submission.*/
const softwareAlertSelector = createSelector(softwarePackages, packages =>
  packages.some(_ => _.softwareKey && _.package.id)
    ? []
    : [
        "No software packages specified. Your submission will fail if tasks rely on any software packages provided by Conductor."
      ]
);

const assetsAlertSelector = createSelector(assetsSelector, assets =>
  assets.length === 0
    ? [
        "No files selected for upload. If your tasks operate on some assets, you'll need to add them in the files tab."
      ]
    : []
);

const scoutFramesAlertSelector = createSelector(
  scoutFrameSpec,
  frameSpec,
  (scoutFrameSpec, frameSpec) =>
    scoutFrameSpec === "" && [...Sequence(frameSpec).getFrames()].length > 10
      ? [
          "You are rendering several frames with no scout frames. All tasks will start rendering immediately. To avoid incurring a significant cost, we strongly recommend you turn on scout frames and check them before you commit to a whole sequence."
        ]
      : []
);

///////////////////////////////

const submissionValidSelector = createSelector(
  softwareAlertSelector,
  assetsAlertSelector,
  scoutFramesAlertSelector,
  submissionSelector,
  (softwareAlerts, assetsAlerts, scoutFramesAlerts, submission) => {
    const errors = Object.keys(submission)
      .filter(
        _ =>
          typeof submission[_] === "object" &&
          submission[_] !== null &&
          submission[_].errors
      )
      .map(_ => submission[_].errors)
      .flat();

    const alerts = [...softwareAlerts, ...assetsAlerts, ...scoutFramesAlerts];

    return { errors, alerts };
  }
);

const submissionPreviewSelector = createSelector(
  submissionSelector,
  submission => {
    return {
      ...submission,
      upload_paths: condenseArray(submission.upload_paths),
      tasks_data: condenseArray(submission.tasks_data)
    };
  }
);

export {
  scoutFramesSelector,
  taskDataSelector,
  assetFilenamesSelector,
  assetsSelector,
  softwarePackageIdsSelector,
  environmentSelector,
  instanceTypeNameSelector,
  instanceTypeSelector,
  jobTitleSelector,
  projectSelector,
  outputPathSelector,
  submissionValidSelector,
  submissionSelector,
  submissionScriptSelector,
  submissionPreviewSelector,
  environmentOverrides,
  assetsMap
};
