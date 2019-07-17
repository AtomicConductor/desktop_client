import { createAction } from "redux-starter-kit";

import { checkResponse } from "../_helpers/network";
import { createRequestOptions } from "../_helpers/network";

import { setNotification } from "./notification";

export const requestProfile = createAction("profile/requestProfile");
export const receiveCredentials = createAction("profile/receiveCredentials");
export const receiveUser = createAction("profile/receiveUser");
export const profileFailure = createAction("profile/profileFailure");
export const receiveAccounts = createAction("profile/receiveAccounts");

export const signOut = createAction("profile/signOut");

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
      // For now, choose the one with highest access rights.
      // In future, save the last used account name in settings.
      const accountId = data.accounts.sort((a, b) =>
        a.role > b.role ? 1 : -1
      )[0].account;
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

// copy creds from one of the accounts into the profile
// Then use those creds to fetch the user
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
  let response = await fetch(url, options);
  checkResponse(response);
  return await response.json();
}
