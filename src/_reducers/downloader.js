import { createReducer } from "@reduxjs/toolkit";

import { setFilterValue, setExpanded } from "../_actions/downloader";

import { requestJobs, receiveJobs } from "../_actions/jobs";
import { setJobQuery } from "../_actions/jobs";
import { TIMESPANS } from "../_helpers/constants";

const initialState = {
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
  [requestJobs]: state => {
    state.loadingJobs = true;
  },

  [receiveJobs]: state => {
    state.loadingJobs = false;
  },
  [setJobQuery]: (state, action) => {
    state.jobQueryParams = { ...state.jobQueryParams, ...action.payload };
  },
  [setFilterValue]: (state, action) => {
    state.jobQueryParams = { ...state.jobQueryParams, ...action.payload };
  }
});

export default downloader;
