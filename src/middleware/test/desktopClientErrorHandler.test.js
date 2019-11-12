import errorHandler from "../desktopClientErrorHandler";
import DesktopClientError from "../../errors/desktopClientError";
import UnauthorizedError from "../../errors/unauthorizedError";

describe("desktopClientErrorHandler", () => {
  let dispatch, getState, sentry;
  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    sentry = {
      captureException: jest.fn(),
      withScope: jest.fn()
    };
  });

  describe("Token has expired", () => {
    const executeTest = wrappedError => {
      errorHandler(sentry)(wrappedError)(dispatch, getState);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: "user/signOut",
        payload: undefined
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: "notification/setNotification",
        payload: {
          type: "error",
          message: "Your session has expired, please sign-in again."
        }
      });
    };

    it("signs user out when inner exception is UnauthorizedError", () => {
      const wrappedError = new DesktopClientError(
        "action error",
        new UnauthorizedError()
      );

      executeTest(wrappedError);
    });

    it("signs user out when wrapper exception is UnauthorizedError", () => {
      executeTest(new UnauthorizedError());
    });
  });

  it("wraps unhandled exceptions with UnhandledApplicationError", () => {
    const unhandledError = new Error("unhandled!");

    errorHandler(sentry)(unhandledError)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({
      type: "notification/setNotification",
      payload: {
        message: "Can't perform action",
        type: "error"
      }
    });
  });

  describe("Sentry integration", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    afterEach(() => {
      process.env.NODE_ENV = "test";
    });

    it("logs to sentry only on production mode", () => {
      const scope = { setUser: jest.fn() };
      sentry.withScope.mockImplementation(_ => _(scope));
      getState.mockReturnValue({
        user: { accounts: [{ selected: true, email: "user@email.com" }] }
      });
      const wrappedError = new DesktopClientError(
        "action error",
        new Error("inner error")
      );

      errorHandler(sentry)(wrappedError)(dispatch, getState);

      expect(scope.setUser).toHaveBeenCalledWith({
        email: "user@email.com"
      });

      expect(sentry.captureException).toHaveBeenCalledWith(
        new Error("inner error")
      );
    });
  });
});
