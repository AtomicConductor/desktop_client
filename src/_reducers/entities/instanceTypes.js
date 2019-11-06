import { createReducer } from "redux-starter-kit";

import { instanceTypesSuccess } from "../../_actions/submitter";

const initialState = {};

const instanceTypes = createReducer(initialState, {
  [instanceTypesSuccess]: (state, action) => {
    action.payload.forEach(_ => {
      state[_.name] = _;
    });
  }
});

export default instanceTypes;