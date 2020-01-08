import { sanitizers } from "../logRocket";
import { createAction } from "@reduxjs/toolkit";
import LogRocket from "logrocket";
import { configureStore } from "@reduxjs/toolkit";
import root from "../../_reducers/root";
import { signInSuccess } from "../../_actions/user";

jest.mock("logrocket");

describe("LogRocket Sanitizers", () => {
  const { actionSanitizer, stateSanitizer } = sanitizers;

  describe("stateSanitizer", () => {
    it("exclude state that should not be captured", () => {
      const store = configureStore({ reducer: root });
      store.dispatch(
        signInSuccess([
          {
            selected: true,
            name: "my account",
            id: "1234",
            email: "joe@email.com",
            token: "do not capture"
          }
        ])
      );

      expect(stateSanitizer(store.getState())).toEqual(
        expect.objectContaining({
          user: {
            accounts: [
              {
                selected: true,
                id: "1234",
                email: "joe@email.com",
                name: "my account"
              }
            ]
          },
          entities: null,
          notification: null,
          plugins: null
        })
      );
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
