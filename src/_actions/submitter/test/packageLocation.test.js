import {
  loadPackageLocation,
  savePackageLocation,
  resetPackageLocation
} from "../packageLocation";
import { settings } from "../../../_helpers/constants";

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
      loadPackageLocation()(dispatch);

      expect(localStorage.getItem).toHaveBeenCalledWith(
        settings.packageLocation
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPackageLocation",
        payload: ""
      });
    });

    it("loads package path from locastorage if already present", () => {
      localStorage.getItem.mockReturnValueOnce("/saved/path");

      loadPackageLocation(null)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPackageLocation",
        payload: "/saved/path"
      });
    });
  });

  describe("savePackageLocation", () => {
    it("saves truthy package path", () => {
      savePackageLocation("/package/path")(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPackageLocation",
        payload: "/package/path"
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        settings.packageLocation,
        "/package/path"
      );
    });

    it("saves falsy package path as empty string", () => {
      savePackageLocation(null)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPackageLocation",
        payload: ""
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        settings.packageLocation,
        ""
      );
    });
  });

  describe("resetPackagePath", () => {
    it("resolves and saves default Package path when valid", () => {
      const dispatcher = _ => _(dispatch);
      resetPackageLocation()(dispatcher);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPackageLocation",
        payload: ""
      });
    });
  });
});
