import {
  loadPythonLocation,
  savePythonLocation,
  resetPythonLocation,
  validSetPythonLocation
} from "../pythonLocation";
import { settings as kSettings } from "../../../_helpers/constants";

describe("pythonLocation", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
    global.localStorage.__proto__ = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };
  });

  describe("loadPythonLocation", () => {
    it("resolves and saves python path if not already present in localstorage", async () => {
      const pythonPathResolver = jest
        .fn()
        .mockReturnValueOnce("/resolved/path/python");

      const dispatcher = _ => _(dispatch);
      await loadPythonLocation(pythonPathResolver)(dispatcher);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        kSettings.pythonLocation,
        "/resolved/path/python"
      );
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });

    it("loads python path from local storage if already present", async () => {
      localStorage.getItem.mockReturnValueOnce("saved/path");

      await loadPythonLocation(null)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("savePythonLocation", () => {
    it("saves truthy python path", () => {
      savePythonLocation("/python/path")(dispatch);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        kSettings.pythonLocation,
        "/python/path"
      );

      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });

    it("saves falsy python path as empty string", () => {
      savePythonLocation(null)(dispatch);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        kSettings.pythonLocation,
        ""
      );
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("resetPythonPath", () => {
    it("resolves and saves default Python path", async () => {
      const pythonPathResolver = jest.fn(() => "default/python/path");

      const dispatcher = _ => _(dispatch);
      await resetPythonLocation(pythonPathResolver)(dispatcher);

      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("validSetPythonLocation", () => {
    it("sets python path to be valid", async () => {
      const validator = jest.fn().mockReturnValueOnce(true);
      const location = "/good/python/path";
      await validSetPythonLocation(location, validator)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "settings/setPythonLocation",
        payload: {
          location: "/good/python/path",
          valid: true
        }
      });
    });

    it("sets python path to be invalid", async () => {
      const validator = jest.fn().mockReturnValueOnce(false);
      const location = "/bad/python/path";
      await validSetPythonLocation(location, validator)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "settings/setPythonLocation",
        payload: {
          location: "/bad/python/path",
          valid: false
        }
      });
    });
  });
});
