import { createReducer } from "@reduxjs/toolkit";
import { isDeepStrictEqual } from "util";
import {
  setJobTitle,
  setFrameSpec,
  setChunkSize,
  setTileSpec,
  setScoutFrameSpec,
  setUseTiles,
  setUseScoutFrames,
  setPreemptible,
  setRetries,
  setOutputPath,
  addAssets,
  removeAssets,
  updateSelectedSoftware,
  applyResetSubmission,
  setEnvEntry
} from "../_actions/submitter";

import { setProject } from "../_actions/submitter/fetchProjects";
import { setInstanceType } from "../_actions/submitter/fetchInstanceTypes";
import {
  submissionRequested,
  submissionFinished,
  validationRequested,
  validationFinished,
  clearValidationResult
} from "../_actions/submitter/submit";
import {
  saveSubmissionSuccess,
  loadSubmissionSuccess
} from "../_actions/submitter/submissionPersistence";

import { setTaskTemplate } from "../_actions/submitter/taskTemplate";
const initialState = {
  filename: "",
  loading: false,

  submitting: false,
  validationResult: { errors: [], alerts: [], missingAssets: [] },
  submission: {
    retries: 3,
    preemptible: true,
    chunkSize: 1,
    force: false,
    instanceType: { name: "", description: "" },
    jobTitle: "Desktop client test",
    localUpload: true,
    uploadOnly: false,
    notify: null,
    frameSpec: "1-10",
    tileSpec: "1-9",
    scoutFrameSpec: "1",
    useTiles: false,
    useScoutFrames: false,
    softwarePackages: [{ softwareKey: "", package: {} }],
    taskTemplate: "",
    uploadPaths: [],
    assets: {},
    environmentOverrides: [{ key: "", value: "" }],
    environment: {},
    project: "",
    outputPath: "/tmp/renders"
  }
};

export default createReducer(initialState, {
  [setJobTitle]: (state, { payload }) => {
    state.submission.jobTitle = payload;
  },
  [setFrameSpec]: (state, { payload }) => {
    state.submission.frameSpec = payload;
  },
  [setChunkSize]: (state, { payload }) => {
    //TODO: html5 min, max on input
    state.submission.chunkSize = Math.max(Math.trunc(payload), 1);
  },
  [setTileSpec]: (state, { payload }) => {
    state.submission.tileSpec = payload;
  },
  [setScoutFrameSpec]: (state, { payload }) => {
    state.submission.scoutFrameSpec = payload;
  },
  [setUseTiles]: (state, { payload }) => {
    state.submission.useTiles = payload;
  },
  [setUseScoutFrames]: (state, { payload }) => {
    state.submission.useScoutFrames = payload;
  },
  [setPreemptible]: (state, { payload }) => {
    state.submission.preemptible = payload;
  },
  [setRetries]: (state, { payload }) => {
    state.submission.retries = Math.max(Math.trunc(payload), 0);
  },
  [setInstanceType]: (state, { payload }) => {
    state.submission.instanceType = payload;
  },
  [setProject]: (state, { payload }) => {
    state.submission.project = payload;
  },
  [setOutputPath]: (state, { payload }) => {
    state.submission.outputPath = payload;
  },

  [setTaskTemplate]: (state, { payload }) => {
    state.submission.taskTemplate = payload;
  },
  [addAssets]: (state, { payload }) => {
    state.submission.assets = {
      ...state.submission.assets,
      ...payload
    };
  },
  [removeAssets]: (state, { payload }) => {
    payload.forEach(_ => {
      //TODO: check if defensive check is necessary
      if (state.submission.assets.hasOwnProperty(_)) {
        delete state.submission.assets[_];
      }
    });
  },

  [updateSelectedSoftware]: (state, { payload }) => {
    const {
      submission: { softwarePackages }
    } = state;
    const { index, softwareKey, package: pkg } = payload;
    const removeSoftware = softwareKey === "" && pkg === "";
    const emptyEntry = { softwareKey: "", package: {} };
    const nonEmptyEntryPredicate = _ => !isDeepStrictEqual(_, emptyEntry);

    if (removeSoftware) {
      softwarePackages.splice(index, 1);
    } else {
      softwarePackages[index] = {
        softwareKey,
        package: pkg
      };
    }

    state.submission.softwarePackages = [
      ...softwarePackages.filter(nonEmptyEntryPredicate),
      emptyEntry
    ];
  },
  [saveSubmissionSuccess]: (state, { payload }) => {
    state.filename = payload;
  },
  [loadSubmissionSuccess]: (state, { payload }) => {
    state.submission = payload.submission;
    state.filename = payload.path;
  },
  [applyResetSubmission]: state => {
    state.filename = "";
    state.submission = initialState.submission;
  },

  [setEnvEntry]: (state, { payload }) => {
    const { key, value, index } = payload;
    const { environmentOverrides } = state.submission;
    const emptyEntry = { key: "", value: "" };
    const nonEmptyEntryPredicate = _ =>
      _.key.trim() !== "" || _.value.trim() !== "";

    if (key !== null) {
      environmentOverrides[index].key = key;
    }
    if (value !== null) {
      environmentOverrides[index].value = value;
    }

    state.submission.environmentOverrides = [
      ...environmentOverrides.filter(nonEmptyEntryPredicate),
      emptyEntry
    ];
  },

  [submissionRequested]: (state, action) => {
    state.submitting = true;
  },

  [submissionFinished]: (state, action) => {
    state.submitting = false;
  },
  [validationRequested]: state => {
    state.submitting = true;
  },
  [validationFinished]: (state, { payload }) => {
    state.submitting = false;
    state.validationResult = payload;
  },
  [clearValidationResult]: state => {
    state.validationResult.errors = [];
    state.validationResult.alerts = [];
  }
});
