import { createReducer } from "redux-starter-kit";

import { requestEnv, receiveEnv } from "../_actions/environment";

const checkEnv = env => {
  // console.log(env);
  if (!env) {
    return "Can't get environment";
  }
  if (!env.APISERVER) {
    return "API unavailable";
  }
  return "success";
};

const initialState = {
  environment: ""
};

const environment = createReducer(initialState, {
  [requestEnv]: (state, action) => {
    state.status = "Loading";
  },

  [receiveEnv]: (state, action) => {
    state.status = checkEnv(action.payload);
    state.data = action.payload;
  }
});

export default environment;
