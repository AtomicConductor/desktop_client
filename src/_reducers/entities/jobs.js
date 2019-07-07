import { createReducer } from "redux-starter-kit";

import {
  receiveJobs,
  receiveDownloadFiles,
  receiveDownloadSummary,
  requestDownloadData,
  setFileExistsLocally,
  setOutputPathValue,
  resetOutputPathValue,
  receiveExistingFilesInfo
} from "../../_actions/jobs";

import mock from "../../_helpers/mockEntities";

const initialState = mock["jobs"];

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
    // console.log("receiveDownloadSummary: " + jobLabel);
    if (jobLabel in state) {
      Object.assign(state[jobLabel], {
        originalOutputDirectory: outputDirectory,
        outputDirectory: state[jobLabel].outputDirectory || outputDirectory,
        fileCount: files ? files.length : 0,
        loadingFileData: false
      });
    }
  },

  [receiveExistingFilesInfo]: (state, action) => {
    const { jobLabel, numExisting } = action.payload;
    // console.log("receiveDownloadSummary: " + jobLabel);
    if (jobLabel in state) {
      state[jobLabel].existingFileCount = numExisting;
    }
  },

  [requestDownloadData]: (state, action) => {
    const jobLabel = action.payload;
    state[jobLabel]["loadingFileData"] = true;
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
