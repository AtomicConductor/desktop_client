import * as Sentry from "@sentry/browser";
import { currentAccountSelector, signedInSelector } from "../selectors/account";
import UnhandledApplicationError from "../errors/unhandledApplicationError";
import DesktopClientError from "../errors/desktopClientError";
import { setNotification } from "../_actions/notification";
import UnauthorizedError from "../errors/unauthorizedError";
import { signOut } from "../_actions/user";
import { pushEvent } from "../_actions/log";

const shouldCallSentry = () => process.env.NODE_ENV === "production";
const shouldLogToConsole = () => process.env.NODE_ENV === "development";
const getUnauthorizedError = error =>
  [error, error.inner].find(_ => _ instanceof UnauthorizedError);

export default e => (dispatch, getState) => {
  const state = getState();
  const error =
    e instanceof DesktopClientError ? e : new UnhandledApplicationError(e);
  const { inner, message } = error;

  const possibleUnauthorizedError = getUnauthorizedError(error);
  if (possibleUnauthorizedError) {
    dispatch(signOut());
    dispatch(
      setNotification({
        type: "error",
        message: possibleUnauthorizedError.message
      })
    );

    return;
  }

  if (shouldCallSentry()) {
    try {
      Sentry.withScope(scope => {
        if (signedInSelector(state)) {
          scope.setUser(currentAccountSelector(state));
        }
        Sentry.captureException(inner || error);
      });
    } catch (e) {
      Sentry.captureException(new UnhandledApplicationError(e));
    }
  }

  if (shouldLogToConsole()) {
    console.log(inner || error);
  }

  dispatch(
    setNotification({
      type: "error",
      message
    })
  );

  dispatch(pushEvent(message, "error"));
};
