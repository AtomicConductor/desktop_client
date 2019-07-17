import { createAction } from "redux-starter-kit";

import fs, { promises as fsp } from "fs";
import path from "path";
import { SETTINGS_FILENAME } from "../_helpers/constants";

import { setNotification } from "../_actions/notification";

export const provision = createAction("env/provision");
export const setPySys = createAction("env/setPySys");
export const envFailure = createAction("env/envFailure");
export const updateSettings = createAction("env/updateSettings");

export function writeSettings(settings) {
  return (dispatch, getState) => {
    const filePath = path.join(nw.App.dataPath, SETTINGS_FILENAME);
    console.log(filePath);
    console.log(settings);

    fsp
      .writeFile(filePath, JSON.stringify(settings, null, "\t"))
      .then(() => {
        dispatch(updateSettings(settings));
        dispatch(
          setNotification({ snackbar: "Saved settings", type: "success" })
        );
      })
      .catch(err => {
        dispatch(envFailure(err.message));
      });
  };
}

export function readSettings() {
  return (dispatch, getState) => {
    const filePath = path.join(nw.App.dataPath, SETTINGS_FILENAME);
    console.log("READ SETTINGS");
    console.log(filePath);

    const settings = fs.readFileSync(filePath, { encoding: "utf8" });

    try {
      dispatch(updateSettings(JSON.parse(settings)));
    } catch (error) {
      dispatch(updateSettings());
      dispatch(envFailure(error.message));
    }
  };
}
