import { createAction } from "redux-starter-kit";
import { PythonShell as ps } from "python-shell";

import { promisify } from "util";
import { promises as fsp } from "fs";
import path from "path";
import { settingsFilename } from "../helpers/constants";
/* config based stuff */
export const provision = createAction("env/provision");
export const setPySys = createAction("env/setPySys");
export const envFailure = createAction("env/envFailure");
export const saveSettings = createAction("env/saveSettings");

/*
Thunk to run python scripts.
*/
const psAsync = promisify(ps.run);

const options = {
  mode: "text",
  pythonPath: "/Users/julian/.virtualenvs/ccc/bin/python",
  pythonOptions: ["-u"]
};

export function setPythonSys(params) {
  return (dispatch, getState) => {
    psAsync("/Users/julian/dev/cnw/src/experiment.py", options)
      .then(response => {
        return dispatch(setPySys(response));
      })
      .catch(err => {
        dispatch(envFailure(err.message));
      });
  };
}

/*
Thunk to save Settings to persistent storage.
// */

export function writeSettings(settings) {
  return (dispatch, getState) => {
    const filePath = path.join(nw.App.dataPath, settingsFilename);

    fsp
      .writeFile(filePath, JSON.stringify(settings, null, "\t"))
      .then(() => {
        dispatch(saveSettings(settings));
      })
      .catch(err => {
        dispatch(envFailure(err.message));
      });
  };
}

export function readSettings() {
  return (dispatch, getState) => {
    const filePath = path.join(nw.App.dataPath, settingsFilename);

    fsp
      .readFile(filePath, {
        encoding: "utf8"
      })
      .then(settings => {
        const obj = JSON.parse(settings);
        dispatch(saveSettings(obj));
      })
      .catch(err => {
        dispatch(envFailure(err.message));
        dispatch(provision());
      });
  };
}
