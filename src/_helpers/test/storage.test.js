import AppStorage from "../storage";

describe("storage", () => {
  let fs, nw, storage;

  beforeEach(() => {
    fs = {
      writeFile: jest.fn().mockImplementation((path, data, cb) => cb()),
      exists: jest.fn(),
      readFile: jest.fn()
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

  it("merges credentials if file already has data", async () => {
    const savedCredentials = '{ "accounts": [] }';
    fs.exists.mockImplementation((path, cb) => cb(null, true));
    fs.readFile.mockImplementation((path, cb) => cb(null, savedCredentials));

    await storage.saveCredentials({ additionalData: "test" });

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.anything(),
      '{"accounts":[],"additionalData":"test"}',
      expect.anything()
    );
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
});
