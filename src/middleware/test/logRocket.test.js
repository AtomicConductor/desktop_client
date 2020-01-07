import { sanitizers } from "../logRocket";
import { createAction } from "@reduxjs/toolkit";
import LogRocket from "logrocket";
jest.mock("logrocket");

describe("LogRocket Sanitizers", () => {
  const { actionSanitizer, stateSanitizer } = sanitizers;

  describe("stateSanitizer", () => {
    it("exclude state that should not be captured", () => {
      const state = {
        entities: {},
        notification: {},
        plugins: {},
        accounts: [{ selected: true, id: "1234", email: "joe2email.com" }]
      };

      expect(stateSanitizer(state)).toEqual({
        accounts: [{ selected: true, id: "1234", email: "joe2email.com" }],
        entities: null,
        notification: null,
        plugins: null
      });
    });
  });

  describe("actionSanitizer", () => {
    it("identifies user when action is signIn", () => {
      const signIn = createAction("user/signInSuccess");

      actionSanitizer(
        signIn([{ selected: true, id: "1234", email: "joe@email.com" }])
      );

      expect(LogRocket.identify).toHaveBeenCalledWith("1234", {
        email: "joe@email.com"
      });
    });

    it("passes through any other action that is not signIn", () => {
      const sanitizedAction = actionSanitizer(createAction("test")());

      expect(sanitizedAction).toEqual({ type: "test", payload: undefined });
    });
  });
});
