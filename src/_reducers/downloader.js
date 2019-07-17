import { createReducer } from "redux-starter-kit";

import {
  toggleDrawer,
  toggleUseDaemon,
  runDownloadJobs,
  downloadProgress,
  addFileToQueue
} from "../_actions/downloader";

import { requestJobs, receiveJobs } from "../_actions/jobs";
import { setJobQuery } from "../_actions/jobs";
import { TIMESPANS } from "../_helpers/constants";

const initialState = {
  drawerOpen: true,
  useDaemon: false,
  queue: [],
  downloadProgress: [],
  loadingJobs: false,
  jobQueryParams: {
    span: TIMESPANS.THISMONTH
  }
};

const downloader = createReducer(initialState, {
  [toggleDrawer]: state => {
    state.drawerOpen = !state.drawerOpen;
  },

  [toggleUseDaemon]: state => {
    state.useDaemon = !state.useDaemon;
  },

  [requestJobs]: state => {
    state.loadingJobs = true;
  },

  [receiveJobs]: state => {
    state.loadingJobs = false;
  },

  [addFileToQueue]: (state, action) => {
    if (!state.queue.some(qel => qel.md5 === action.payload.md5)) {
      state.queue.push(action.payload);
    }
  },

  [downloadProgress]: (state, action) => {
    console.log(action.payload);
    state.downloadProgress.push(action.payload);
  },
  [setJobQuery]: (state, action) => {
    state["jobQueryParams"] = { ...state["jobQueryParams"], ...action.payload };
  }
});

export default downloader;

// setTaskValue,
// setJobValue,
// setOutputPathValue,
// setJobSuggestions,
// clearJobSuggestions,
// setTaskSuggestions,
// clearTaskSuggestions,

// jobSuggestions: [],
// jobValue: "00702",
// taskValue: "",
// taskSuggestions: [],
// outputPathValue: "",
// [setJobValue]: (state, action) => {
//   state.jobValue = action.payload;
// },

// [setJobSuggestions]: (state, action) => {
//   const inputValue = action.payload.value.trim();
//   const inputLength = inputValue.length;
//   const jobSuggestions =
//     inputLength === 0
//       ? []
//       : jobids.filter(jobid => jobid.slice(0, inputLength) === inputValue);
//   state.jobSuggestions = jobSuggestions;
// },

// [clearJobSuggestions]: state => {
//   state.jobSuggestions = [];
// },

// [setTaskValue]: (state, action) => {
//   state.taskValue = action.payload;
// },

// [setTaskSuggestions]: (state, action) => {
//   const inputValue = action.payload.value.trim();
//   const inputLength = inputValue.length;
//   const taskSuggestions =
//     inputLength === 0
//       ? []
//       : taskids.filter(taskid => taskid.slice(0, inputLength) === inputValue);
//   state.taskSuggestions = taskSuggestions;
// },

// [clearTaskSuggestions]: state => {
//   state.taskSuggestions = [];
// },
