import { createReducer } from "redux-starter-kit";
import { provision } from "../_actions/environment";
import config from "../../config";

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
  data: ""
};

const environment = createReducer(initialState, {
  [provision]: (state, action) => {
    const node_env = process.env["NODE_ENV"];
    let env = {
      mode: node_env,
      ...config.default,
      ...config[node_env]
    };
    state.data = env;
  }
});

export default environment;
