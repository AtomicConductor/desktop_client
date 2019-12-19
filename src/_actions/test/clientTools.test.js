import signInClientTools from "../clientTools";

describe("clientTools", () => {
  let expirationDateInTicks, getState, storage;
  beforeEach(() => {
    expirationDateInTicks = 1234567890;
    getState = jest.fn().mockReturnValue({
      user: {
        accounts: [
          {
            id: 1,
            name: "",
            token: "TOKEN",
            email: "",
            selected: true,
            avatar: ""
          }
        ]
      }
    });
    storage = { writeClientToolsCredentials: jest.fn() };
  });

  it("writes token to client tools .config path", async () => {
    const dispatch = jest.fn();
    const decoder = jest
      .fn()
      .mockImplementation(() => ({ exp: expirationDateInTicks }));

    await signInClientTools(storage, decoder)(dispatch, getState);

    expect(decoder).toHaveBeenCalledWith("TOKEN", "", true);
    expect(storage.writeClientToolsCredentials).toHaveBeenCalledWith({
      access_token: "TOKEN",
      token_type: "Bearer",
      expiration: expirationDateInTicks,
      scope: ["user"]
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "log/pushEvent",
      payload: expect.objectContaining({
        level: "info",
        text: "Signed in to client tools",
        time: expect.any(Number)
      })
    });
  });

  it("throws an error when sign in fails", async () => {
    const decoder = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    await expect(
      signInClientTools(storage, decoder)(null, getState)
    ).rejects.toThrow("Can't sign in to client tools");
  });

  describe("when primary sign in fails", () => {
    it("does not write token to client tools .config", async () => {
      const decoder = jest.fn();
      const dispatch = jest.fn();
      getState = jest.fn(() => ({
        user: {
          accounts: []
        }
      }));

      await signInClientTools(storage, decoder)(dispatch, getState);

      expect(decoder).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
      expect(storage.writeClientToolsCredentials).not.toHaveBeenCalled();
    });
  });
});
