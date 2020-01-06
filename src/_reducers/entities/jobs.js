import { createReducer } from "redux-starter-kit";

import {
  receiveJobs,
  setOutputPathValue,
  resetOutputPathValue
} from "../../_actions/jobs";

import {
  receiveDownloadData,
  receiveExistingFilesInfo,
  setFileExists,
  requestDownloadData
} from "../../_actions/files";

import os from "os";

export const LOADING_KEYS = {
  NONE: 0,
  DOWNLOAD_DETAILS: 1,
  EXISTING_FILES: 2
};

const PLATFORM = os.platform();
const WIN32 = PLATFORM === "win32";

const initialState = {};

const prepareForPlatform = directory => {
  if (WIN32) {
    return directory;
  }
  return directory ? directory.replace(/^[a-zA-Z]:/, "") : "";
};

//TODO: unit test
const jobs = createReducer(initialState, {
  [receiveJobs]: (state, action) => {
    //TODO: move mapping logic into a normalizer
    const data = action.payload.data;
    const newJobs = Array.isArray(data) ? data : data ? [data] : [];
    // eslint-disable-next-line no-unused-vars
    for (const k in state) {
      if (state.hasOwnProperty(k)) {
        delete state[k];
      }
    }
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

  [receiveDownloadData]: (state, action) => {
    const { files, jobLabel } = action.payload;

    if (jobLabel in state) {
      Object.assign(state[jobLabel], {
        files,
        loadingKey: LOADING_KEYS.NONE
      });
    }
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
      Object.keys(state[jobLabel].files || {}).forEach(relativePath => {
        state[jobLabel].files[relativePath].exists = 0;
      });

      existing.forEach(relativePath => {
        state[jobLabel].files[relativePath].exists = 100;
      });

      state[jobLabel].loadingKey = LOADING_KEYS.NONE;
    }
  },

  [setFileExists]: (state, action) => {
    const { jobLabel, relativePath, percentage } = action.payload;
    if (jobLabel in state && relativePath in state[jobLabel].files) {
      state[jobLabel].files[relativePath].exists = percentage;
    }
  },

  [requestDownloadData]: (state, action) => {
    const jobLabel = action.payload;
    state[jobLabel].loadingKey = LOADING_KEYS.DOWNLOAD_DETAILS;
  },

  [setOutputPathValue]: (state, action) => {
    const { jobLabel, value } = action.payload;
    if (jobLabel in state) {
      state[jobLabel].outputDirectory = value;
    }
  },

  [resetOutputPathValue]: (state, action) => {
    const { jobLabel } = action.payload;
    if (jobLabel in state) {
      state[jobLabel].outputDirectory = state[jobLabel].originalOutputDirectory;
    }
  }
});

export default jobs;
