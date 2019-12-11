import { createReducer } from "redux-starter-kit";

import {
  toggleDrawer,
  downloadProgress,
  addFileToQueue,
  setFilterValue,
  setExpanded
} from "../_actions/downloader";

import { requestJobs, receiveJobs } from "../_actions/jobs";
import { setJobQuery } from "../_actions/jobs";
import { TIMESPANS } from "../_helpers/constants";

const initialState = {
  drawerOpen: true,
  queue: [],
  downloadProgress: [],
  loadingJobs: false,
  expandedJob: "",
  jobQueryParams: {
    span: TIMESPANS.THISMONTH,
    textFilter: ""
  }
};

const downloader = createReducer(initialState, {
  [setExpanded]: (state, action) => {
    state.expandedJob = action.payload;
  },

  [toggleDrawer]: state => {
    state.drawerOpen = !state.drawerOpen;
  },

  [requestJobs]: state => {
    state.loadingJobs = true;
  },

  [receiveJobs]: state => {
    state.loadingJobs = false;
  },

  //TODO: is this still used?
  [addFileToQueue]: (state, action) => {
    if (!state.queue.some(qel => qel.md5 === action.payload.md5)) {
      state.queue.push(action.payload);
    }
  },

  [downloadProgress]: (state, action) => {
    state.downloadProgress.push(action.payload);
  },
  [setJobQuery]: (state, action) => {
    state.jobQueryParams = { ...state.jobQueryParams, ...action.payload };
  },
  [setFilterValue]: (state, action) => {
    state.jobQueryParams = { ...state.jobQueryParams, ...action.payload };
  }
});

export default downloader;
