import { createReducer } from 'redux-starter-kit'



import {
  DL_TOGGLE_DRAWER,
  DL_TOGGLE_USE_DAEMON,
  DL_SET_JOB_SUGGESTIONS,
  DL_CLEAR_JOB_SUGGESTIONS,
  DL_SET_JOB_SEARCH_INPUT_VALUE
} from "../_actions/downloader";

/*
Initialize the downloader page state with the drawer closed.

*/



const initialState = {
  drawerOpen: false,
  useDaemon: false,
  jobSuggestions: [],
  jobInputValue: ""
};



const downloader = createReducer(initialState, {
  DL_TOGGLE_DRAWER: (state, action) => {
    state.drawerOpen = !state.drawerOpen
  },
  DL_TOGGLE_USE_DAEMON: (state, action) => {
    state.useDaemon = !state.useDaemon
 
  },
  DL_SET_JOB_SUGGESTIONS: (state, action) => {

    const inputValue = action.value.value.trim();
    const inputLength = inputValue.length;
    const jobSuggestions = inputLength === 0
      ? []
      : jobids.filter(jobid => jobid.slice(0, inputLength) === inputValue);
    state.jobSuggestions = jobSuggestions
  }



})



const jobids = [];
for (var i = 876; i < 908; i++) {
  jobids.push(("00000" + i).substr(-5, 5));
}

function downloader(state = initialState, action) {
  switch (action.type) {
    case DL_TOGGLE_DRAWER:
      return Object.assign({}, state, {
        drawerOpen: !state.drawerOpen
      });

    case DL_TOGGLE_USE_DAEMON:
      return Object.assign({}, state, {
        useDaemon: !state.useDaemon
      });


    case DL_SET_JOB_SUGGESTIONS:
 
      
      const inputValue = action.value.value.trim();
      const inputLength = inputValue.length;
      const jobSuggestions = inputLength === 0
        ? []
        : jobids.filter(jobid => jobid.slice(0, inputLength) === inputValue);

      return Object.assign({}, state, {
        jobSuggestions
      });

    case DL_CLEAR_JOB_SUGGESTIONS:
      return Object.assign({}, state, {
        jobSuggestions: []
      });

    case DL_SET_JOB_SEARCH_INPUT_VALUE:
      return Object.assign({}, state, {
        jobInputValue: action.value
      });

    default:
      return state;
  }
}

export default downloader;
