import { createReducer } from "redux-starter-kit";

import {
  toggleDrawer,
  toggleUseDaemon,
  setTaskValue,
  setJobValue,
  setOutputPathValue,
  setJobSuggestions,
  clearJobSuggestions,
  setTaskSuggestions,
  clearTaskSuggestions,
  runDownloadJobs,
  downloadProgress
} from "../_actions/downloader";

const initialState = {
  drawerOpen: false,
  useDaemon: false,
  jobSuggestions: [],
  jobValue: "00702",
  taskValue: "",
  taskSuggestions: [],
  outputPathValue: "",
  downloadProgress: []
};

const jobids = [];
for (var i = 876; i < 908; i++) {
  jobids.push(("00000" + i).substr(-5, 5));
}

const taskids = [];
for (var i = 0; i < 30; i++) {
  taskids.push(("000" + i).substr(-3, 3));
}

const downloader = createReducer(initialState, {
  [toggleDrawer]: state => {
    state.drawerOpen = !state.drawerOpen;
  },

  [toggleUseDaemon]: state => {
    state.useDaemon = !state.useDaemon;
  },

  [setJobValue]: (state, action) => {
    state.jobValue = action.payload;
  },

  [setJobSuggestions]: (state, action) => {
    const inputValue = action.payload.value.trim();
    const inputLength = inputValue.length;
    const jobSuggestions =
      inputLength === 0
        ? []
        : jobids.filter(jobid => jobid.slice(0, inputLength) === inputValue);
    state.jobSuggestions = jobSuggestions;
  },

  [clearJobSuggestions]: state => {
    state.jobSuggestions = [];
  },

  [setTaskValue]: (state, action) => {
    state.taskValue = action.payload;
  },

  [setTaskSuggestions]: (state, action) => {
    const inputValue = action.payload.value.trim();
    const inputLength = inputValue.length;
    const taskSuggestions =
      inputLength === 0
        ? []
        : taskids.filter(taskid => taskid.slice(0, inputLength) === inputValue);
    state.taskSuggestions = taskSuggestions;
  },

  [clearTaskSuggestions]: state => {
    state.taskSuggestions = [];
  },

  [setOutputPathValue]: (state, action) => {
    console.log(action.payload);
    state.outputPathValue = action.payload;
  },

  [downloadProgress]: (state, action) => {
    console.log(action.payload);
    state.downloadProgress.push(action.payload);
  }
});

export default downloader;
