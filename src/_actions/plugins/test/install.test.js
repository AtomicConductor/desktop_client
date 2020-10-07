import { getInstalledInfo } from "../install";

describe("plugins", () => {
  let dispatch, readfile, getState;

  beforeEach(() => {
    dispatch = jest.fn();

    getState = jest.fn().mockReturnValue({
      settings: {
        packageLocation: "/path/to/pkgs",
        pythonLocation: "/path/to/python"
      },
      plugins: {
        items: {
          a: { order: 3, packageName: "pkga", name: "a" },
          b: { order: 1, packageName: "pkgb", name: "b" },
          c: { order: 2, packageName: "pkgc", name: "c" }
        }
      }
    });
    readfile = jest.fn();
    readfile.mockImplementationOnce((fn, enc, cb) => cb(null, "1.0.0"));
  });

  describe("getInstalledInfo", () => {
    it("sets installed version for first packages", async () => {
      readfile.mockImplementationOnce((fn, enc, cb) => cb(null, "1.0.0"));
      getInstalledInfo(readfile)(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: "plugins/setInstalledVersion",
        payload: expect.objectContaining({ name: "b", installed: "1.0.0" })
      });
    });

    it("sets installed false for package without version file", async () => {
      readfile.mockImplementation((fn, enc, cb) => cb("error occurred", null));
      getInstalledInfo(readfile)(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: "plugins/setInstalledVersion",
        payload: expect.objectContaining({ name: "c", installed: false })
      });
    });
  });
});
