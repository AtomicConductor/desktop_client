import { createSelector } from "reselect";

const message = state =>
  state.notification.message ? state.notification.message.trim() : "";
const url = state =>
  state.notification.url ? state.notification.url.trim() : "";
const type = state => state.notification.type;
const buttonLabel = state => state.notification.buttonLabel;

const snackbarSelector = createSelector(
  message,
  type,
  url,
  buttonLabel,
  (message, type, url, buttonLabel) => ({
    message,
    type,
    url: buttonLabel !== "" ? url : "",
    buttonLabel,
    show: message !== ""
  })
);

export { snackbarSelector };
