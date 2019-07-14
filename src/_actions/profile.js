import { createAction } from "redux-starter-kit";
import { promises as fsp } from "fs";
import { checkResponse } from "../_helpers/network";
import { createRequestOptions } from "../_helpers/network";

import { setNotification } from "./notification";

export const requestProfile = createAction("profile/requestProfile");
export const receiveCredentials = createAction("profile/receiveCredentials");
export const receiveUser = createAction("profile/receiveUser");
export const profileFailure = createAction("profile/profileFailure");
export const receiveAccounts = createAction("profile/receiveAccounts");

export const signOut = createAction("profile/signOut");

// export const setCredentials = createAction("profile/setCredentials");

/*
Thunk to read credentials from disk AND fetch the users profile.
A number of things can go wrong here, any of which will result 
in a profileFailure action being dispatched.
*/
export function fetchProfile(params) {
  return (dispatch, getState) => {
    const apiServer = getState().environment.project.apiServer;

    dispatch(requestProfile());

    fsp
      .readFile("/Users/julian/.config/conductor/credentials", {
        encoding: "utf8"
      })
      .then(credentials => {
        const obj = JSON.parse(credentials);
        dispatch(receiveCredentials(obj));

        return fetch(`${apiServer}/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${obj.access_token}`
          }
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Authentication error: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        return dispatch(receiveUser(json));
      })
      .catch(err => {
        dispatch(profileFailure(err.message));
      });
  };
}

/*
Thunk to authenticate.
*/

export function signIn(params) {
  return async function(dispatch, getState) {
    dispatch(requestProfile());
    try {
      const data = await authenticate(getState(), params);
      dispatch(receiveAccounts(data));

      // We have the accounts, choose one
      // For now, choose the one with highest priority
      const accountId = data.accounts.sort((a, b) =>
        a.role > b.role ? 1 : -1
      )[0].account;

      // const accountId = data.accounts[1].account;

      console.log(accountId);
      dispatch(chooseAccount(accountId));
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          snackbar: error.message
        })
      );
    }
  };
}

async function authenticate(state, params) {
  // options is just headers, content type etc.
  const options = {
    ...createRequestOptions(state),
    method: "POST",
    body: JSON.stringify(params)
  };
  let url = `${state.environment.project.apiServer}/api/auth`;
  let response = await fetch(url, options);
  checkResponse(response);
  return await response.json();
}

// copy the creds from one of the accounts into the profile
//
export function chooseAccount(accountId) {
  return async function(dispatch, getState) {
    const state = getState();

    try {
      dispatch(requestProfile());
      if (!(accountId in state.entities.accounts)) {
        throw Error("No accounts to choose from");
      }
      const account = state.entities.accounts[accountId];
      dispatch(receiveCredentials(account));

      const data = await getChosenUser(getState());
      dispatch(receiveUser(data));
    } catch (error) {
      dispatch(receiveUser({}));
      dispatch(
        setNotification({
          type: "error",
          snackbar: error.message
        })
      );
    }
  };
}

async function getChosenUser(state) {
  const options = createRequestOptions(state);
  const apiServer = state.environment.project.apiServer;
  let url = `${apiServer}/api/v1/profile`;

  console.log(url);
  console.log(options);

  let response = await fetch(url, options);
  checkResponse(response);
  return await response.json();
}

// export function writeCredentials(settings) {
//   return (dispatch, getState) => {
//     const filePath = path.join(nw.App.dataPath, SETTINGS_FILENAME);

//     fsp
//       .writeFile(filePath, JSON.stringify(settings, null, "\t"))
//       .then(() => {
//         dispatch(updateSettings(settings));
//         dispatch(
//           setNotification({ snackbar: "Saved settings", type: "success" })
//         );
//       })
//       .catch(err => {
//         dispatch(envFailure(err.message));
//       });
//   };
// }

// export function readCredentials() {
//   return (dispatch, getState) => {
//     const filePath = path.join(nw.App.dataPath, SETTINGS_FILENAME);

//     fsp
//       .readFile(filePath, {
//         encoding: "utf8"
//       })
//       .then(settings => {
//         const obj = JSON.parse(settings);
//         dispatch(updateSettings(obj));
//         return dispatch(fetchProfile());
//       })
//       .catch(err => {
//         dispatch(updateSettings());
//         dispatch(envFailure(err.message));
//         // dispatch(provision());
//       });
//   };
// }
