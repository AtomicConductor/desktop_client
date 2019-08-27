import { createAction } from "redux-starter-kit";
import fs from "fs";
import path from "upath";
import { checkResponse } from "../_helpers/network";
import { createRequestOptions } from "../_helpers/network";

import { setNotification } from "./notification";
import { CREDENTIALS_FILENAME } from "../_helpers/constants";
import config from '../config';

export const requestProfile = createAction("profile/requestProfile");
export const receiveCredentials = createAction("profile/receiveCredentials");
export const receiveUser = createAction("profile/receiveUser");
export const profileFailure = createAction("profile/profileFailure");
export const receiveAccounts = createAction("profile/receiveAccounts");

export const signOut = createAction("profile/signOut");

const validateParams = params => {
  if (params.error) {
    console.log("ERROR:" + params.error);
    throw Error(params.error);
  }

  if (params.email && params.password) {
    console.log(params.email + " / " + params.password);
    return params;
  }

  try {
    const id_token = params.getAuthResponse(true).id_token;
    console.log(id_token);
    return { id_token };
  } catch {
    throw Error("Can't log in with the given parameters");
  }
};

export function signIn(params) {
  return async function (dispatch, getState) {
    dispatch(requestProfile());
    try {
      console.log(JSON.stringify(params));
      const authParams = validateParams(params);
      const data = await authenticate(getState(), authParams);

      dispatch(receiveAccounts(data));

      let accountId;
      try {
        const creds = JSON.parse(
          fs.readFileSync(path.join(nw.App.dataPath, CREDENTIALS_FILENAME), {
            encoding: "utf8"
          }) || {}
        );
        const { lastAccount } = creds;
        if (
          lastAccount &&
          data.accounts.some(acc => {
            return acc.account === lastAccount;
          })
        ) {
          accountId = lastAccount;
        }
      } catch {
        // If anything goes wrong, just leave accountId undefined.
        //
      }
      if (!accountId) {
        accountId = data.accounts.sort((a, b) => (a.role > b.role ? 1 : -1))[0]
          .account;
      }

      // We have the accounts, choose one.
      // For now, choose the one with highest access rights.
      // In future, save the last used account name in settings.

      await dispatch(chooseAccount(accountId));
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

export function deleteSession() {
  return async function (dispatch, getState) {
    try {
      dispatch(signOut());

      const creds = fs.readFileSync(
        path.join(nw.App.dataPath, CREDENTIALS_FILENAME),
        { encoding: "utf8" }
      );
      const { lastAccount } = JSON.parse(creds);
      let result = {};
      if (lastAccount) {
        result = { lastAccount };
      }

      fs.writeFileSync(
        path.join(nw.App.dataPath, CREDENTIALS_FILENAME),
        JSON.stringify(result)
      );
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
  let url = `${config.apiServer}/api/auth`;
  let response = await fetch(url, options);
  checkResponse(response);
  return await response.json();
}

// copy creds from one of the accounts into the profile
// Then use those creds to fetch the user
export function chooseAccount(accountId) {
  return async function (dispatch, getState) {
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

      /** Write to disk so we may auto sign in next time*/
      dispatch(writeAccounts());
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
  const { apiServer } = config;
  let url = `${apiServer}/api/v1/profile`;
  let response = await fetch(url, options);
  checkResponse(response);
  return await response.json();
}

export function writeAccounts() {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const filePath = path.join(nw.App.dataPath, CREDENTIALS_FILENAME);
      const data = {
        lastAccount: state.profile.user.data.account,
        accounts: Object.values(state.entities.accounts)
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
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

export function signInFromSaved() {
  return async (dispatch, getState) => {
    // const state = getState();
    try {
      const filePath = path.join(nw.App.dataPath, CREDENTIALS_FILENAME);
      const creds = fs.readFileSync(filePath, { encoding: "utf8" });
      const { lastAccount, accounts } = JSON.parse(creds);

      // console.log(lastAccount, accounts);

      if (!accounts.length) {
        throw Error("No accounts in credentials file");
      }

      dispatch(receiveAccounts({ accounts }));
      dispatch(chooseAccount(lastAccount));
    } catch (error) {
      console.log("Couldn't sign in from saved credentials.");
      // dispatch(
      //   setNotification({
      //     type: "info",
      //     snackbar: "Couldn't sign in from saved credentials."
      //   })
      // );
    }
  };
}
