import { createReducer } from "redux-starter-kit";
import {
  clearNotification,
  showNotificationDetails,
  setNotification
} from "../_actions/notification";

import { receiveUser, profileFailure } from "../_actions/profile";
import { envFailure, setPySys, updateSettings } from "../_actions/environment";
// import { runDownloadJobs } from "../_actions/downloader";

import {
  pythonScriptFailure,
  setPythonScriptResponse
} from "../_actions/python";

const initialState = {
  snackbar: "",
  detail: "",
  show: "none",
  type: "info"
};

const notification = createReducer(initialState, {
  [clearNotification]: (state, action) => {
    Object.assign(state, initialState);
  },

  // [setNotification]: (state, action) => {
  //     state.snackbar = action.payload.snackbar;
  //     state.detail = action.payload.detail;
  //     state.show = !!action.payload.snackbar ? "snackbar" : "none";
  // },

  [showNotificationDetails]: (state, action) => {
    state.show = !!action.payload.detail ? "detail" : "none";
  },

  [setNotification]: (state, action) => {
    state.snackbar = action.payload.snackbar;
    state.detail = action.payload.detail || "";
    state.show = !!action.payload ? "snackbar" : "none";
    state.type = action.payload.type;
  },

  [profileFailure]: (state, action) => {
    state.snackbar = action.payload;
    state.detail = `Some more details ${action.payload}`;
    state.show = !!action.payload ? "snackbar" : "none";
    state.type = "error";
  },

  [receiveUser]: (state, action) => {
    state.snackbar = "Successfully signed in";
    state.detail = "";
    state.show = "snackbar";
    state.type = "success";
  },

  [envFailure]: (state, action) => {
    state.snackbar = action.payload;
    state.detail = `Some more details ${action.payload}`;
    state.show = !!action.payload ? "snackbar" : "none";
    state.type = "error";
  },

  // [runDownloadJobs]: (state, action) => {
  //   state.snackbar = `Starting download`;
  //   state.detail = "";
  //   state.show = "snackbar";
  //   state.type = "success";
  // },

  [pythonScriptFailure]: (state, action) => {
    state.snackbar = `Python script failed ${action.payload}`;
    state.detail = "";
    state.show = "snackbar";
    state.type = "error";
  },

  [setPythonScriptResponse]: (state, action) => {
    state.snackbar = `Python script success ${action.payload}`;
    state.detail = "";
    state.show = "snackbar";
    state.type = "info";
  }
  // [updateSettings]: (state, action) => {
  //   state.snackbar = `Saved settings`;
  //   state.detail = "";
  //   state.show = "snackbar";
  //   state.type = "success";
  // }
});

export default notification;
