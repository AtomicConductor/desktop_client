import { createReducer } from "redux-starter-kit";
import {
  clearNotification,
  showNotificationDetails,
  setNotification
} from "../_actions/notification";

import { receiveUser, profileFailure } from "../_actions/profile";
import { envFailure } from "../_actions/environment";
// import { runDownloadJobs } from "../_actions/downloader";

// import {
//   pythonScriptFailure,
//   setPythonScriptResponse
// } from "../_actions/python";

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

  // [receiveUser]: (state, action) => {
  //   state.snackbar = "Successfully signed in";
  //   state.detail = "";
  //   state.show = "snackbar";
  //   state.type = "success";
  // },

  [envFailure]: (state, action) => {
    state.snackbar = action.payload;
    state.detail = `Some more details ${action.payload}`;
    state.show = !!action.payload ? "snackbar" : "none";
    state.type = "error";
  }
});

export default notification;
