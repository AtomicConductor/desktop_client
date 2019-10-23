import feedback from "../feedback";
import nock from "nock";
import config from "../../config";

describe("feedback", () => {
  let dispatch, getState, os, nw;
  const input = {
    email: "user@email.com",
    subject: "feedback subject",
    message: "feedback message"
  };

  beforeEach(() => {
    dispatch = jest.fn();
    os = {
      platform: jest.fn().mockReturnValue("darwin"),
      release: jest.fn().mockReturnValue("10.x")
    };
    nw = { App: { manifest: { version: "1.0.0" } } };
  });

  describe("when user is no signed in", () => {
    it("does not send account id", async () => {
      const getState = jest
        .fn()
        .mockReturnValueOnce({ user: { accounts: [] } });
      nock(config.feedbackHookUrl)
        .post("/", {
          email: "user@email.com",
          subject: "feedback subject",
          message: "feedback message",
          accountId: null,
          os: {
            release: "10.x",
            platform: "darwin"
          },
          appVersion: "1.0.0"
        })
        .reply(200);

      await expect(feedback(input, os, nw)(dispatch, getState)).resolves.toBe(
        undefined
      );
    });
  });

  describe("when user is signed in", () => {
    beforeEach(() => {
      getState = jest.fn().mockReturnValue({
        user: {
          accounts: [{ id: 123456789, selected: true, email: "user@email.com" }]
        }
      });
    });

    it("dispatches success notification when feeback submission succeeds", async () => {
      nock(config.feedbackHookUrl)
        .post("/", {
          email: "user@email.com",
          subject: "feedback subject",
          message: "feedback message",
          accountId: 123456789,
          os: {
            release: "10.x",
            platform: "darwin"
          },
          appVersion: "1.0.0"
        })
        .reply(200);

      await feedback(input, os, nw)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          type: "success",
          snackbar: "Thank you for your feedback!"
        },
        type: "notification/setNotification"
      });
    });

    it("dispatches failure notification when feedback submission fails", async () => {
      await expect(feedback(input, os, nw)(dispatch, getState)).rejects.toThrow(
        "Can't submit feedback"
      );
    });
  });
});
