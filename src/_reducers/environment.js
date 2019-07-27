import { createReducer } from "redux-starter-kit";
import { updateSettings } from "../_actions/environment";
import { googleProjects } from "../_helpers/constants";
import path from "upath";

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

    console.log(JSON.stringify(process));

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
      platform: process.platform,
      cwd: process.cwd(),
      execPath: process.execPath,
      flavor: process.versions["nw-flavor"],
      // port: process.env["PORT"],
      appDataPath: nw.App.dataPath,
      NODE_ENV: node_env
    };
    state.python = {
      scriptsPath:
        node_env === "development"
          ? path.join(path.dirname(process.cwd()), "public", "scripts")
          : path.join(process.cwd(), "scripts")
    };
  }
});

export default environment;
