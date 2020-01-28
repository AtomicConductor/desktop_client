import { createReducer } from "@reduxjs/toolkit";

import { projectsSuccess } from "../../_actions/submitter/fetchProjects";

const initialState = [];

//TODO: unit test
const projects = createReducer(initialState, {
  [projectsSuccess]: (state, action) => [...action.payload]
});

export default projects;
