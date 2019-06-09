import { createReducer } from "redux-starter-kit";

import {
  toggleDrawer,
  toggleUseDaemon,
  setJobInputValue,
  setJobSuggestions,
  clearJobSuggestions
} from "../_actions/downloader";

const initialState = {
  drawerOpen: false,
  useDaemon: false,
  jobSuggestions: [],
  jobInputValue: ""
};

const jobids = [];
for (var i = 876; i < 908; i++) {
  jobids.push(("00000" + i).substr(-5, 5));
}

const downloader = createReducer(initialState, {
  [toggleDrawer]: (state, action) => {
    // console.log("HHHHHHHHEEEEEEEE");
    state.drawerOpen = !state.drawerOpen;
  },

  [toggleUseDaemon]: (state, action) => {
    state.useDaemon = !state.useDaemon;
  },

  [setJobInputValue]: (state, action) => {
    console.log(action.payload);
    state.jobInputValue = action.payload;
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

  [clearJobSuggestions]: (state, action) => {
    state.jobSuggestions = [];
  }
});

export default downloader;
