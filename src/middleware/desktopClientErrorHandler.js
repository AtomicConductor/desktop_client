import { currentAccountSelector, signedInSelector } from "../selectors/account";
import UnhandledApplicationError from "../errors/unhandledApplicationError";
import DesktopClientError from "../errors/desktopClientError";
import { setNotification } from "../_actions/notification";
import UnauthorizedError from "../errors/unauthorizedError";
import { signOut } from "../_actions/user";

const shouldCallSentry = () => process.env.NODE_ENV === "production";
const shouldLogToConsole = () => process.env.NODE_ENV === "development";

export default sentry => e => (dispatch, getState) => {
  const state = getState();
  const error =
    e instanceof DesktopClientError ? e : new UnhandledApplicationError(e);
  const { inner, message } = error;

  if (inner instanceof UnauthorizedError) {
    dispatch(signOut());
    dispatch(
      setNotification({
        type: "error",
        snackbar: inner.message
      })
    );

    return;
  }

  if (shouldCallSentry()) {
    sentry.withScope(scope => {
      if (signedInSelector(state)) {
        scope.setUser(currentAccountSelector(state));
      }
      sentry.captureException(inner);
    });
  }

  if (shouldLogToConsole()) {
    console.log(inner);
  }

  dispatch(
    setNotification({
      type: "error",
      snackbar: message
    })
  );
};
