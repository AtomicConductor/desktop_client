import { createReducer } from "redux-starter-kit";
import {
  clearNotification,
  showNotificationDetails,
  setNotification
} from "../_actions/notification";

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
  }
});

export default notification;
