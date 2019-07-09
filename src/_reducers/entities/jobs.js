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

import { updateFileDownloaded } from "../../_actions/files";

import mock from "../../_helpers/mockEntities";

const initialState = mock["jobs"];
// const initialState = {};

const jobs = createReducer(initialState, {
  [receiveJobs]: (state, action) => {
    const data = action.payload.data;
    const newJobs = Array.isArray(data) ? data : data ? [data] : [];
    newJobs.forEach(job => {
      state[job.jobLabel] = { ...job, ...state[job.jobLabel] };
    });
  },

  [receiveDownloadSummary]: (state, action) => {
    const { jobLabel, outputDirectory, files } = action.payload;

    if (jobLabel in state) {
      Object.assign(state[jobLabel], {
        originalOutputDirectory:
          state[jobLabel].originalOutputDirectory || outputDirectory,
        outputDirectory: state[jobLabel].outputDirectory || outputDirectory,
        files,
        loadingMessage: ""
      });
    }
  },

  [requestExistingFilesInfo]: (state, action) => {
    const jobLabel = action.payload;
    state[jobLabel]["loadingMessage"] = "Checking for existing files";
  },

  [receiveExistingFilesInfo]: (state, action) => {
    const { jobLabel, existing } = action.payload;
    /**
     * existing is an array of relativePaths (file keys) that exist
     * [ folder1/file.1.exr,
     *  folder1/file.2.exr,
     * folder1/file.3.exr
     * ]
     *
     * They are the only files that exist for this job.
     * Therefore, set all files to not existi8ng first
     */
    if (jobLabel in state) {
      Object.keys(state[jobLabel]["files"]).forEach(relativePath => {
        state[jobLabel]["files"][relativePath].exists = false;
      });

      existing.forEach(relativePath => {
        state[jobLabel]["files"][relativePath].exists = true;
      });

      state[jobLabel]["loadingMessage"] = "";
    }
  },

  [updateFileDownloaded]: (state, action) => {
    const { jobLabel, file } = action.payload;
    if (jobLabel in state) {
      if (file.relativePath in state[jobLabel]["files"]) {
        state[jobLabel]["files"][file.relativePath]["exists"] = true;
      }
    }
  },

  // [setFileExists]: (state, action) => {
  //   const { file, exists } = action.payload;

  //   if (jobLabel in state && relativePath in state[jobLabel]["files"]) {
  //     if (relativePath in state[jobLabel]) {
  //       state[jobLabel]["files"].exists = exists;
  //     }
  //   }
  // },

  [requestDownloadData]: (state, action) => {
    const jobLabel = action.payload;
    state[jobLabel]["loadingMessage"] = "Fetching download information";
  },

  [setFileExistsLocally]: (state, action) => {
    const { jobLabel, relativePath, exists } = action.payload;
    state[jobLabel].files[relativePath].exists = exists;
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
