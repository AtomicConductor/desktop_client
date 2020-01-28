import { createReducer } from "@reduxjs/toolkit";

import { instanceTypesSuccess } from "../../_actions/submitter/fetchInstanceTypes";

const initialState = {};

const instanceTypes = createReducer(initialState, {
  [instanceTypesSuccess]: (state, action) => {
    //TODO: remove into a normalizer
    action.payload.forEach(_ => {
      state[_.name] = _;
    });
  }
});

export default instanceTypes;
