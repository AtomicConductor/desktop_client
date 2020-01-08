import * as Sentry from "@sentry/browser";
import errorHandler from "../desktopClientErrorHandler";
import DesktopClientError from "../../errors/desktopClientError";
import UnauthorizedError from "../../errors/unauthorizedError";
import UnhandledApplicationError from "../../errors/unhandledApplicationError";
import AppStorage from "../../_helpers/storage";
jest.mock("@sentry/browser");
jest.mock("../../_helpers/storage");

describe("desktopClientErrorHandler", () => {
  let dispatch, getState;
  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
  });

  describe("Token has expired", () => {
    const executeTest = wrappedError => {
      const dispatcher = jest
        .fn(dispatch)
        .mockImplementationOnce(_ => _(dispatch));

      errorHandler(wrappedError)(dispatcher, getState);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: "user/resetUserState",
        payload: undefined
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: "notification/setNotification",
        payload: {
          type: "error",
          message: "Your session has expired, please sign-in again."
        }
      });

      const mockAppStorage = AppStorage.mock.instances[0];
      expect(mockAppStorage.saveCredentials).toHaveBeenCalledWith({});
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

    errorHandler(unhandledError)(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "notification/setNotification",
      payload: {
        message: "Can't perform action",
        type: "error"
      }
    });

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "log/pushEvent",
      payload: expect.objectContaining({
        text: "Can't perform action",
        level: "error"
      })
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
      Sentry.withScope.mockImplementation(_ => _(scope));
      getState.mockReturnValue({
        user: { accounts: [{ selected: true, email: "user@email.com" }] }
      });
      const wrappedError = new DesktopClientError(
        "action error",
        new Error("inner error")
      );

      errorHandler(wrappedError)(dispatch, getState);

      expect(scope.setUser).toHaveBeenCalledWith({
        email: "user@email.com"
      });

      expect(Sentry.captureException).toHaveBeenCalledWith(
        new Error("inner error")
      );
    });

    it("logs UnhandledApplicationError error when accessing store state fails", () => {
      const scope = { setUser: jest.fn() };
      Sentry.withScope.mockImplementation(_ => _(scope));
      getState.mockReturnValue({ invalidState: {} });

      errorHandler(new DesktopClientError())(dispatch, getState);

      expect(scope.setUser).not.toHaveBeenCalledWith();
      expect(Sentry.captureException).toHaveBeenCalledWith(
        new UnhandledApplicationError()
      );
    });
  });
});
