import { createAction } from "@reduxjs/toolkit";
import config from "../config";
import axios from "../_helpers/axios";
import { avatarInitials } from "../_helpers/presentation";
import { emailSelector, accountsSelector } from "../selectors/account";
import * as Sentry from "@sentry/browser";
import AppStorage from "../_helpers/storage";
import { fetchJobs } from "../_actions/jobs";
import { fetchProjects, fetchInstanceTypes } from "../_actions/submitter";
import { pushEvent } from "../_actions/log";
import DesktopClientError from "../errors/desktopClientError";
import UnauthorizedError from "../errors/unauthorizedError";
import validCredentialsSchema from "../_helpers/credentialsSchemaValidator";

const signInSuccess = createAction("user/signInSuccess");
const signInError = createAction("user/signInError");
const signInRequest = createAction("user/signInRequest");
const resetUserState = createAction("user/resetUserState");
const switchAccount = createAction("user/switchAccount");

//TODO: refactor into a normalizer
const mapAccounts = accounts =>
  accounts
    .sort((a, b) => a.role - b.role)
    .map((_, index) => ({
      id: _.account,
      name: _.accountName,
      token: _.token,
      email: _.email,
      selected: index === 0,
      avatar: avatarInitials(_)
    }));

const signIn = (credentials, storage = new AppStorage()) => async (
  dispatch,
  getState
) => {
  try {
    dispatch(signInRequest());

    const response = await axios.post(
      `${config.apiServer}/api/auth`,
      credentials
    );
    const {
      data: { accounts }
    } = response;

    if (!accounts) throw new Error("No active accounts");

    const mappedAccounts = mapAccounts(accounts);
    await storage.saveCredentials({ accounts: mappedAccounts });
    dispatch(signInSuccess(mappedAccounts));
    dispatch(pushEvent("Successfully signed in", "info"));

    // remove after beta phase
    await flagBetaUser(emailSelector(getState()));
  } catch (e) {
    dispatch(signInError());
    throw new DesktopClientError("Can't sign in", e);
  }
};

const signInFromSaved = (storage = new AppStorage()) => async dispatch => {
  const credentials = await storage.readCredentials();

  if (credentials === undefined) return;

  if (!validCredentialsSchema(credentials)) {
    throw new UnauthorizedError();
  }

  dispatch(signInSuccess(credentials.accounts));
  dispatch(pushEvent("Loaded saved credentials", "info"));
};

const selectAccount = (id, storage = new AppStorage()) => async (
  dispatch,
  getState
) => {
  dispatch(switchAccount(id));
  dispatch(fetchJobs());
  dispatch(fetchProjects());
  dispatch(fetchInstanceTypes());
  const { selectedAccount, otherAccounts } = accountsSelector(getState());
  await storage.saveCredentials({
    accounts: [selectedAccount, ...otherAccounts]
  });
};

const signOut = (storage = new AppStorage()) => async dispatch => {
  storage.saveCredentials({});
  dispatch(resetUserState());
};

// TODO: remove after beta phase
const flagBetaUser = async (email, storage = localStorage) => {
  const betaUserFlagKey = "isBetaUser";
  if (storage.getItem(betaUserFlagKey)) return;

  const { contactApiUrl, apiKey } = config.hubSpot;
  const payload = {
    properties: [
      {
        property: "beta_user",
        value: true
      }
    ]
  };

  try {
    await axios.post(
      `${contactApiUrl}/email/${email}/profile?hapikey=${apiKey}`,
      payload
    );
    storage.setItem(betaUserFlagKey, true);
  } catch (e) {
    //TODO: typo in below message
    // No need no propagate exception to the user
    Sentry.withScope(scope => {
      scope.setExtras({ source: "hubspot - flag beta user", email });
      Sentry.captureException(e);
    });
  }
};

export {
  signIn,
  signOut,
  resetUserState,
  signInSuccess,
  signInError,
  signInRequest,
  selectAccount,
  switchAccount,
  signInFromSaved
};
