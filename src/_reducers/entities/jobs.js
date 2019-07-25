import { createReducer } from "redux-starter-kit";

import {
  receiveJobs,
  receiveDownloadFiles,
  receiveDownloadSummary,
  requestDownloadData,
  setFileExistsLocally,
  requestExistingFilesInfo,
  setOutputPathValue,
  resetOutputPathValue,
  receiveExistingFilesInfo
} from "../../_actions/jobs";

import { setFileExists } from "../../_actions/files";

import os from "os";

import mock from "../../_helpers/mockEntities";

export const LOADING_KEYS = {
  NONE: 0,
  DOWNLOAD_DETAILS: 1,
  EXISTING_FILES: 2
};

const PLATFORM = os.platform();
const WIN32 = PLATFORM === "win32";
const MAC = PLATFORM === "darwin";
const LINUX = PLATFORM === "linux";

// const initialState = mock["jobs"];
const initialState = {};

const prepareForPlatform = directory => {
  if (WIN32) {
    return directory;
  }
  return directory ? directory.replace(/^[a-zA-Z]:/, "") : "";
};

const jobs = createReducer(initialState, {
  [receiveJobs]: (state, action) => {
    const data = action.payload.data;
    const newJobs = Array.isArray(data) ? data : data ? [data] : [];
    for (const k in state) {
      if (state.hasOwnProperty(k)) {
        delete state[k];
      }
    }
    // console.log(newJobs);
    newJobs.forEach(job => {
      /**
       * If job exists already, dont overwrite the output directory.
       * It may have been edited.
       * */

      const outputDirectory = prepareForPlatform(job.output_path);
      const jobLabel = job.jid;
      const jobSummary = {
        title: job.title || "- No title -",
        submitter: job.submittedBy,
        jobLabel,
        project: job.project,
        created: job.created,
        id: job.id,
        location: job.location,
        originalOutputDirectory: outputDirectory,
        outputDirectory:
          (state[jobLabel] && state[jobLabel].outputDirectory) ||
          outputDirectory,
        owner: job.owner || job.user || "anon"
      };

      state[jobLabel] = jobSummary;
    });
  },

  [receiveDownloadSummary]: (state, action) => {
    const { jobLabel, files } = action.payload;

    if (jobLabel in state) {
      Object.assign(state[jobLabel], {
        files,
        loadingKey: LOADING_KEYS.NONE
      });
    }
  },

  [requestExistingFilesInfo]: (state, action) => {
    const jobLabel = action.payload;
  },

  [receiveExistingFilesInfo]: (state, action) => {
    const { jobLabel, existing } = action.payload;
    /**
     * existing is an array of relativePaths (file keys) that exist on disk
     * [ folder1/file.1.exr,
     *  folder1/file.2.exr,
     * folder1/file.3.exr
     * ]
     *
     * They are the only files that exist for this job.
     * Therefore, set all files to not existing first
     */
    if (jobLabel in state && "files" in state[jobLabel]) {
      Object.keys(state[jobLabel]["files"] || {}).forEach(relativePath => {
        state[jobLabel]["files"][relativePath].exists = false;
      });

      existing.forEach(relativePath => {
        state[jobLabel]["files"][relativePath].exists = true;
      });

      state[jobLabel]["loadingKey"] = LOADING_KEYS.NONE;
    }
  },

  [setFileExists]: (state, action) => {
    const { jobLabel, relativePath } = action.payload;
    if (jobLabel in state && relativePath in state[jobLabel]["files"]) {
      state[jobLabel]["files"][relativePath]["exists"] = true;
    }
  },

  [requestDownloadData]: (state, action) => {
    const jobLabel = action.payload;
    state[jobLabel]["loadingKey"] = LOADING_KEYS.DOWNLOAD_DETAILS;
  },

  [setOutputPathValue]: (state, action) => {
    const { jobLabel, value } = action.payload;
    if (jobLabel in state) {
      state[jobLabel]["outputDirectory"] = value;
    }
  },

  [resetOutputPathValue]: (state, action) => {
    const { jobLabel } = action.payload;
    if (jobLabel in state) {
      state[jobLabel]["outputDirectory"] =
        state[jobLabel]["originalOutputDirectory"];
    }
  }
});

export default jobs;
