import { signInFromSaved, signIn, selectAccount } from "../user";
import config from "../../config";
import nock from "nock";

describe("user", () => {
  let dispatch, appStorage, getState;

  beforeEach(() => {
    dispatch = jest.fn();
    appStorage = {
      readCredentials: jest.fn(),
      saveCredentials: jest.fn()
    };

    global.localStorage.__proto__ = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };

    getState = jest.fn().mockReturnValue({
      user: { accounts: [{ selected: true, email: "joe@email.com" }] }
    });
  });

  describe("signInfromSaved", () => {
    it("signs user in when valid credentials are in local storage", async () => {
      const validCredentials = [
        {
          id: 1,
          name: "",
          email: "",
          token: "",
          avatar: "",
          selected: true
        }
      ];

      appStorage.readCredentials.mockResolvedValueOnce({
        accounts: validCredentials
      });

      await signInFromSaved(appStorage)(dispatch);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        payload: validCredentials,
        type: "user/signInSuccess"
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: "log/pushEvent",
        payload: expect.objectContaining({
          text: "Loaded saved credentials",
          level: "info"
        })
      });
    });

    describe.each([
      {},
      { accounts: {} },
      { accounts: [] },
      {
        accounts: [{ id: "", name: "", email: "", avatar: "", selected: true }]
      },
      {
        accounts: [{ id: "", name: "", email: "", avatar: "", token: "" }]
      },
      {
        accounts: [{ id: "", name: "", email: "", selected: true, token: "" }]
      },
      {
        accounts: [{ id: "", name: "", avatar: "", selected: true, token: "" }]
      },
      {
        accounts: [{ id: "", email: "", avatar: "", selected: true, token: "" }]
      },
      {
        accounts: [
          { name: "", email: "", avatar: "", selected: true, token: "" }
        ]
      }
    ])("when credentials %j have invalid schema", credentials => {
      it("does not sign in user", async () => {
        appStorage.readCredentials.mockResolvedValueOnce(credentials);

        await expect(signInFromSaved(appStorage)(dispatch)).rejects.toThrow(
          "Your session has expired, please sign-in again."
        );
      });
    });
  });

  describe("signIn", () => {
    it("stores credentials in local storage when sign in succeeds", async () => {
      const credentials = { email: "joe@email.com", password: "secret" };

      nock(config.apiServer)
        .post("/api/auth", credentials)
        .reply(200, {
          accounts: [
            {
              account: 1234567890,
              accountName: "my account",
              token: "token",
              email: "joe@email.com",
              role: 1
            }
          ]
        });

      nock(config.hubSpot.contactApiUrl)
        .post("/email/joe@email.com/profile", {
          properties: [{ property: "beta_user", value: true }]
        })
        .query({ hapikey: config.hubSpot.apiKey })
        .reply(204);

      await signIn(credentials, appStorage)(dispatch, getState);

      const mappedAccounts = [
        {
          id: 1234567890,
          name: "my account",
          token: "token",
          email: "joe@email.com",
          selected: true,
          avatar: "J"
        }
      ];

      expect(dispatch).toHaveBeenCalledWith({
        type: "user/signInRequest",
        payload: undefined
      });
      expect(appStorage.saveCredentials).toHaveBeenCalledWith({
        accounts: mappedAccounts
      });
      expect(localStorage.setItem).toHaveBeenCalledWith("isBetaUser", true);
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: "user/signInSuccess",
        payload: mappedAccounts
      });
    });

    it("does not set beta user flag if already exists ", async () => {
      const credentials = { email: "joe@email.com", password: "secret" };

      nock(config.apiServer)
        .post("/api/auth", credentials)
        .reply(200, {
          accounts: [
            {
              account: 1234567890,
              accountName: "my account",
              token: "token",
              email: "joe@email.com",
              role: 1
            }
          ]
        });

      localStorage.getItem.mockReturnValueOnce(true);

      await signIn(credentials, appStorage)(dispatch, getState);

      expect(localStorage.setItem).not.toHaveBeenCalledWith("isBetaUser", true);
    });

    it("throws when there are no active accounts", async () => {
      nock(config.apiServer)
        .post("/api/auth", {})
        .reply(200, {
          accounts: false
        });

      await expect(signIn({}, appStorage)(dispatch)).rejects.toThrow(
        "Can't sign in"
      );

      expect(dispatch.mock.calls[1][0]).toEqual({
        type: "user/signInError",
        payload: undefined
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("selectAccount", () => {
    it("refereshes job list and updates credentials", async () => {
      await selectAccount(1234567890, appStorage)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: "user/switchAccount",
        payload: 1234567890
      });

      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));

      expect(appStorage.saveCredentials).toHaveBeenCalledWith({
        accounts: [{ selected: true, email: "joe@email.com" }]
      });
    });
  });
});
