import { createReducer } from "@reduxjs/toolkit";
import { clearNotification, setNotification } from "../_actions/notification";

const initialState = {
  message: "",
  type: "info",
  url: "",
  buttonLabel: ""
};

const notification = createReducer(initialState, {
  [clearNotification]: (state, action) => {
    Object.assign(state, initialState);
  },
  [setNotification]: (state, { payload }) => {
    state.message = payload.message;
    state.url = payload.url || "";
    state.type = payload.type;
    state.buttonLabel = payload.buttonLabel;
  }
});

export default notification;
