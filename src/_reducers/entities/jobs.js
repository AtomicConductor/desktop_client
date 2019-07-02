import { createReducer } from "redux-starter-kit";

import {
  receiveJobs,
  receiveDownloadFiles,
  requestDownloadFiles,
  setFileExistsLocally
} from "../../_actions/jobs";

import mock from "../../_helpers/mockEntities";

const initialState = mock["jobs"];
// const initialState = {};

const jobs = createReducer(initialState, {
  [receiveJobs]: (state, action) => {
    const data = action.payload.data;
    const newJobs = Array.isArray(data) ? data : data ? [data] : [];
    newJobs.forEach(job => {
      state[job.jobLabel] = job;
      state[job.jobLabel]["files"] = {};
    });
  },

  [receiveDownloadFiles]: (state, action) => {
    const { files, jobLabel, outputDirectory } = action.payload;
    if (!(jobLabel in state)) {
      return;
    }

    if (!state[jobLabel]["files"]) {
      state[jobLabel]["files"] = {};
      state[jobLabel].outputDirectory = outputDirectory;
    }

    state[jobLabel]["loadingFiles"] = false;

    files.forEach(file => {
      const key = file.relativePath;
      state[jobLabel].files[key] = file;
    });
  },

  [requestDownloadFiles]: (state, action) => {
    const jobLabel = action.payload;
    console.log("jobLabel: " + jobLabel);
    state[jobLabel]["loadingFiles"] = true;
  },

  [setFileExistsLocally]: (state, action) => {
    const { jobLabel, relativePath, exists } = action.payload;
    state[jobLabel].files[relativePath].exists = exists;
  }
});

export default jobs;

// setFileExistsLocally
// ({ md5, jobLabel, state: value }
