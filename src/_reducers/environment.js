import { createReducer } from "redux-starter-kit";
import { provision, setPySys, saveSettings } from "../_actions/environment";
import { googleProjects } from "../helpers/constants";

const checkEnv = env => {
  if (!env) {
    return "Can't get environment";
  }
  if (!env.APISERVER) {
    return "API unavailable";
  }
  return "success";
};

const initialState = {
  settings: {
    googleProjectName: "production",
    pythonPath: ""
  },
  project: {}
};

const environment = createReducer(initialState, {
  [saveSettings]: (state, action) => {
    state.settings = action.payload;
    state.project = {
      ...state.project,
      ...googleProjects.find(
        env => env.name === action.payload.googleProjectName
      )
    };
  },

  [provision]: (state, action) => {
    const node_env = process.env["NODE_ENV"];
    state.project = {
      ...state.project,
      ...googleProjects.find(
        env => env.name === state.settings.googleProjectName
      ),
      NODE_ENV: process.env["NODE_ENV"]
    };
  },

  [setPySys]: (state, action) => {
    state.data.pysys = action.payload;
  }
});

export default environment;
