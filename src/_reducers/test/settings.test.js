import reducer from "../settings";
import { setPythonLocation } from "../../_actions/settings/pythonLocation";
import { setPackageLocation } from "../../_actions/settings/packageLocation";

describe("settings reducer", () => {
  describe("setPythonLocation", () => {
    it("updates an existing python", () => {
      const initialState = {
        pythonLocation: "",
        packageLocation: "",
        pythonLocationValid: false
      };

      const state = reducer(
        initialState,
        setPythonLocation({
          location: "/some/path",
          valid: true
        })
      );

      expect(state).toEqual({
        pythonLocation: "/some/path",
        pythonLocationValid: true,
        packageLocation: ""
      });
    });
  });
  describe("setPackageLocation", () => {
    it("updates an existing package", () => {
      const initialState = {
        pythonLocation: "",
        packageLocation: "",
        pythonLocationValid: false
      };

      const state = reducer(initialState, setPackageLocation("/some/path"));

      expect(state).toEqual({
        pythonLocation: "",
        pythonLocationValid: false,
        packageLocation: "/some/path"
      });
    });
  });
});
