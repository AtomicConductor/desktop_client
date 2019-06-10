import { createReducer } from "redux-starter-kit";

import {
  toggleDrawer,
  toggleUseDaemon,
  setTaskValue,
  setJobValue,
  setOutputPathValue,
  setJobSuggestions,
  clearJobSuggestions
} from "../_actions/downloader";

const initialState = {
  drawerOpen: false,
  useDaemon: false,
  jobSuggestions: [],
  jobValue: "",

  taskValue: "",
  outputPathValue: ""
};

const jobids = [];
for (var i = 876; i < 908; i++) {
  jobids.push(("00000" + i).substr(-5, 5));
}

const downloader = createReducer(initialState, {
  [toggleDrawer]: state => {
    state.drawerOpen = !state.drawerOpen;
  },

  [toggleUseDaemon]: state => {
    state.useDaemon = !state.useDaemon;
  },

  [setTaskValue]: (state, action) => {
    console.log(action.payload);
    state.taskInputValue = action.payload;
  },

  [setJobValue]: (state, action) => {
    console.log(action.payload);
    state.jobValue = action.payload;
  },
  [setOutputPathValue]: (state, action) => {
    console.log(action.payload);
    state.outputPathValue = action.payload;
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
  }
});

export default downloader;
