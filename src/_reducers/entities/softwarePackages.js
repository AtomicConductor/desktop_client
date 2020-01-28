import { createReducer } from "@reduxjs/toolkit";
import { softwarePackagesSuccess } from "../../_actions/submitter/fetchSoftwarePackages";

const initialState = {};

export default createReducer(initialState, {
  [softwarePackagesSuccess]: (state, action) => action.payload
});
