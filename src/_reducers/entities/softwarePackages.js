import { createReducer } from "redux-starter-kit";
import { softwarePackagesSuccess } from "../../_actions/submitter";

const initialState = {};

export default createReducer(initialState, {
  [softwarePackagesSuccess]: (state, action) => action.payload
});
