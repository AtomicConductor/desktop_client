import { currentAccountSelector, signedInSelector } from "../selectors/account";
import UnhandledApplicationError from "../errors/unhandledApplicationError";
import DesktopClientError from "../errors/desktopClientError";
import { setNotification } from "../_actions/notification";
import UnauthorizedError from "../errors/unauthorizedError";
import { signOut } from "../_actions/user";

const shouldCallSentry = () => process.env.NODE_ENV === "production";
const shouldLogToConsole = () => process.env.NODE_ENV === "development";
const getUnauthorizedError = error =>
  [error, error.inner].find(_ => _ instanceof UnauthorizedError);

export default sentry => e => (dispatch, getState) => {
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
    sentry.withScope(scope => {
      if (signedInSelector(state)) {
        scope.setUser(currentAccountSelector(state));
      }
      sentry.captureException(inner || error);
    });
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
};
