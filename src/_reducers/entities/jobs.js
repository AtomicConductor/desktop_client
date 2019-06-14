import { createReducer } from "redux-starter-kit";

import { requestJobs, receiveJobs } from "../../_actions/jobs";

const initialState = [];

const jobs = createReducer(initialState, {
  //   [receiveJobs]: (state, action) => {
  //     const data = action.payload.data;
  //     const newJobs = Array.isArray(data) ? data : data ? [data] : [];
  //     newJobs.forEach(job => {
  //       state[job.id] = job;
  //     });
  //   }

  [receiveJobs]: (state, action) => {
    // const data = action.payload.data;
    const data = action.payload;
    const newJobs = Array.isArray(data) ? data : data ? [data] : [];
    newJobs.forEach(job => {
      state.push(job);
    });
  }
});

export default jobs;
