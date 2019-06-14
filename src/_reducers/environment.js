import { createReducer } from "redux-starter-kit";
import { updateSettings } from "../_actions/environment";
import { googleProjects } from "../_helpers/constants";
import path from "upath";

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
  project: {},
  process: {},
  python: {}
};

const environment = createReducer(initialState, {
  [updateSettings]: (state, action) => {
    const node_env = process.env["NODE_ENV"];

    if (action.payload) {
      state.settings = action.payload;
    }

    state.project = {
      ...state.project,
      ...googleProjects.find(
        env => env.name === state.settings.googleProjectName
      )
    };
    state.process = {
      cwd: process.cwd(),
      execPath: process.execPath,
      NODE_ENV: node_env
    };

    // const filePath = path.join(nw.App.dataPath, settingsFilename);

    state.python = {
      scriptsPath:
        node_env === "development"
          ? path.join(path.dirname(process.cwd()), "public", "scripts")
          : path.join(process.cwd(), "scripts")
    };
  }
});

export default environment;
