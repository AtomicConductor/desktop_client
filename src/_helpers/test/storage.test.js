import AppStorage from "../storage";

describe("storage", () => {
  let fs, nw, storage;

  beforeEach(() => {
    fs = {
      writeFile: jest.fn().mockImplementation((path, data, cb) => cb()),
      exists: jest.fn(),
      readFile: jest.fn(),
      mkdir: jest.fn().mockImplementation((path, cb) => cb())
    };

    nw = {
      App: { dataPath: "data/path" }
    };

    storage = new AppStorage(nw, fs);
  });

  it("saves credentials", async () => {
    fs.exists.mockImplementation((path, cb) => cb(null, false));

    await storage.saveCredentials({ accounts: [] });

    expect(fs.writeFile).toHaveBeenCalledWith(
      "data/path/credentials.json",
      '{"accounts":[]}',
      expect.anything()
    );
  });

  it("reads credentials", async () => {
    const savedCredentials = '{ "accounts": [] }';
    fs.exists.mockImplementation((path, cb) => cb(null, true));
    fs.readFile.mockImplementation((path, cb) => cb(null, savedCredentials));

    const credentials = await storage.readCredentials();

    expect(credentials).toEqual({ accounts: [] });
  });

  it("deletes a preset", async () => {
    const savedPresets = '{ "foo": {}, "bar": {} }';
    fs.exists.mockImplementation((path, cb) => cb(null, true));
    fs.readFile.mockImplementation((path, cb) => cb(null, savedPresets));

    await storage.deletePreset("foo");

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.anything(),
      '{"bar":{}}',
      expect.anything()
    );
  });

  describe("writeClientToolsCredentials", () => {
    const os = { homedir: jest.fn(() => "/home") };
    const credentials = {};

    it("writes credentials to .config directory", async () => {
      fs.exists.mockImplementation((path, cb) => cb(null, true));

      await storage.writeClientToolsCredentials(credentials, os);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "/home/.config/conductor/credentials",
        "{}",
        expect.any(Function)
      );
    });

    it("create .config directory if it doesn't exist", async () => {
      fs.exists.mockImplementation((path, cb) => cb(null, false));

      await storage.writeClientToolsCredentials(credentials, os);

      expect(fs.mkdir).toHaveBeenCalledWith(
        "/home/.config/conductor",
        expect.any(Function)
      );
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });
});
