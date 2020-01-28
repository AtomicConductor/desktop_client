import {
  loadPythonLocation,
  savePythonLocation,
  resetPythonLocation
} from "../pythonLocation";
import { settings } from "../../../_helpers/constants";

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
    let pythonPathValidator = jest.fn(() => true);
    it("resolves and saves python path if not already present in localstorage", async () => {
      const pythonPathResolver = jest
        .fn()
        .mockReturnValueOnce("/saved/path/python");

      const dispatcher = _ => _(dispatch);
      await loadPythonLocation(
        pythonPathResolver,
        pythonPathValidator
      )(dispatcher);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        settings.pythonLocation,
        "/saved/path/python"
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPythonLocation",
        payload: "/saved/path/python"
      });
    });

    it("loads python path from locastorage if already present", async () => {
      localStorage.getItem.mockReturnValueOnce("saved/path");

      await loadPythonLocation(null, pythonPathValidator)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPythonLocation",
        payload: "saved/path"
      });
    });
  });

  describe("savePythonLocation", () => {
    it("throw an exception when python path is invalid", async () => {
      const pythonPathValidator = jest.fn(() => false);

      await expect(
        savePythonLocation("/python/path", pythonPathValidator)(null)
      ).rejects.toThrow("Invalid python 2.7 location");

      expect(pythonPathValidator).toHaveBeenCalledWith("/python/path");
    });
  });

  describe("resetPythonPath", () => {
    it("resolves and saves default Python path", async () => {
      const pythonPathValidator = jest.fn(() => true);
      const pythonPathResolver = jest.fn(() => "default/python/path");

      const dispatcher = _ => _(dispatch);
      await resetPythonLocation(
        pythonPathResolver,
        pythonPathValidator
      )(dispatcher);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPythonLocation",
        payload: "default/python/path"
      });
    });
  });
});
