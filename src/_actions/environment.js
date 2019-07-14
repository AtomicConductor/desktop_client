import { createAction } from "redux-starter-kit";

import { promises as fsp } from "fs";
import path from "path";
import { SETTINGS_FILENAME } from "../_helpers/constants";

import { setNotification } from "../_actions/notification";
import { fetchProfile } from "../_actions/profile";

/* config based stuff */
export const provision = createAction("env/provision");
export const setPySys = createAction("env/setPySys");
export const envFailure = createAction("env/envFailure");
export const updateSettings = createAction("env/updateSettings");

/*
Thunk to run python scripts.
*/
// const psAsync = promisify(ps.run);

// const options = {
//   mode: "text",
//   pythonPath: "/Users/julian/.virtualenvs/ccc/bin/python",
//   pythonOptions: ["-u"]
// };

// export function setPythonSys(params) {
//   return (dispatch, getState) => {
//     psAsync("/Users/julian/dev/cnw/src/experiment.py", options)
//       .then(response => {
//         return dispatch(setPySys(response));
//       })
//       .catch(err => {
//         dispatch(envFailure(err.message));
//       });
//   };
// }

/*
Thunk to save Settings to persistent storage.
// */

export function writeSettings(settings) {
  return (dispatch, getState) => {
    const filePath = path.join(nw.App.dataPath, SETTINGS_FILENAME);

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

    fsp
      .readFile(filePath, {
        encoding: "utf8"
      })
      .then(settings => {
        const obj = JSON.parse(settings);
        dispatch(updateSettings(obj));
        // return dispatch(fetchProfile());
      })
      .catch(err => {
        dispatch(updateSettings());
        dispatch(envFailure(err.message));
        // dispatch(provision());
      });
  };
}
