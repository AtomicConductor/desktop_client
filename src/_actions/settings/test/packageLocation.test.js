import {
  loadPackageLocation,
  savePackageLocation,
  resetPackageLocation
} from "../packageLocation";
import { settings as kSettings } from "../../../_helpers/constants";

describe("packageLocation", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
    global.localStorage.__proto__ = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };
  });
  describe("loadPackageLocation", () => {
    it("resolves and saves package path if not already present in localstorage", () => {
      loadPackageLocation("default")(dispatch);

      expect(localStorage.getItem).toHaveBeenCalledWith(
        kSettings.packageLocation
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: "settings/setPackageLocation",
        payload: "default"
      });
    });

    it("loads package path from locastorage if already present", () => {
      localStorage.getItem.mockReturnValueOnce("/saved/path");

      loadPackageLocation(null)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "settings/setPackageLocation",
        payload: "/saved/path"
      });
    });
  });

  describe("savePackageLocation", () => {
    it("saves truthy package path", () => {
      savePackageLocation("/package/path")(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "settings/setPackageLocation",
        payload: "/package/path"
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        kSettings.packageLocation,
        "/package/path"
      );
    });

    it("saves falsy package path as empty string", () => {
      savePackageLocation(null)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "settings/setPackageLocation",
        payload: ""
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        kSettings.packageLocation,
        ""
      );
    });
  });

  describe("resetPackageLocation", () => {
    it("resolves and saves default Package path when valid", () => {
      const dispatcher = _ => _(dispatch);
      resetPackageLocation("default")(dispatcher);

      expect(dispatch).toHaveBeenCalledWith({
        type: "settings/setPackageLocation",
        payload: "default"
      });
    });
  });
});
