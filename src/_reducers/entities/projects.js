import { createReducer } from "redux-starter-kit";

import { projectsSuccess } from "../../_actions/submitter";

const initialState = [];

const projects = createReducer(initialState, {
  [projectsSuccess]: (state, action) => [...action.payload]
});

export default projects;
