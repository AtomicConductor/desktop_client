import reducer from "../plugins";
import {
  installationRequested,
  installationFinished,
  setInstalledVersion,
  openPluginHelp,
  closePluginHelp
} from "../../_actions/plugins/install";

import { receivePyPiVersions } from "../../_actions/plugins/fetchAvailableVersions";

describe("plugins reducer", () => {
  describe("installationRequested", () => {
    it("updates installing state if found plugin name", () => {
      const initialState = {
        installing: null,
        items: { a: { available: "pip" } }
      };
      const state = reducer(initialState, installationRequested("a"));
      expect(state).toEqual(expect.objectContaining({ installing: "a" }));
    });
    it("doesn't update installing state if it can't find plugin name", () => {
      const initialState = {
        installing: null,
        items: { a: { available: "pip" } }
      };
      const state = reducer(initialState, installationRequested("b"));
      expect(state.installing).toBeNull();
    });
    it("doesn't update installing state if not available", () => {
      const initialState = {
        installing: null,
        items: { a: { available: false } }
      };
      const state = reducer(initialState, installationRequested("a"));
      expect(state.installing).toBeNull();
    });
  });

  describe("installationFinished", () => {
    it("sets installing state to null", () => {
      const state = reducer({ installing: "a" }, installationFinished());
      expect(state.installing).toBeNull();
    });
  });

  describe("setInstalledVersion", () => {
    it("sets installed version if item exists", () => {
      const initialState = {
        installing: null,
        items: { a: { installed: false } }
      };

      const state = reducer(
        initialState,
        setInstalledVersion({ name: "a", installed: "1.0.0" })
      );
      expect(state.items).toEqual(
        expect.objectContaining({ a: { installed: "1.0.0" } })
      );
    });

    it("does nothing if item does not exist", () => {
      const initialState = {
        installing: null,
        items: { a: { installed: false } }
      };

      const state = reducer(
        initialState,
        setInstalledVersion({ name: "b", installed: "1.0.0" })
      );
      expect(state.items).toEqual(
        expect.not.objectContaining({ b: expect.anything() })
      );
    });
  });

  describe("openPluginHelp an closePluginHelp", () => {
    it("sets helpOpen to name if name exists", () => {
      const initialState = {
        items: { a: {} }
      };

      const state = reducer(initialState, openPluginHelp("a"));
      expect(state.helpOpen).toEqual("a");
    });

    it("sets helpOpen to false if name does not exist", () => {
      const initialState = {
        items: { a: {} }
      };

      const state = reducer(initialState, openPluginHelp("b"));
      expect(state.helpOpen).toBeFalsy();
    });

    it("sets helpOpen to false on closePluginHelp", () => {
      const initialState = {
        helpOpen: "a"
      };

      const state = reducer(initialState, closePluginHelp());
      expect(state.helpOpen).toBeFalsy();
    });
  });

  describe("receivePyPiVersions", () => {
    it("sets the array of versions", () => {
      const initialState = {
        items: { a: { versions: ["old", "versions"] } }
      };
      const payload = {
        name: "a",
        description: "Some description",
        packageName: "pkga",
        versions: ["1.0.0", "1.1.0"]
      };
      const state = reducer(initialState, receivePyPiVersions(payload));
      expect(state.items.a).toEqual(
        expect.objectContaining({ versions: ["1.0.0", "1.1.0"] })
      );
    });
  });

  //   describe("setPackageLocation", () => {
  //     it("updates an existing package", () => {
  //       const initialState = {
  //         pythonLocation: "",
  //         packageLocation: "",
  //         pythonLocationValid: false
  //       };

  //       const state = reducer(initialState, setPackageLocation("/some/path"));

  //       expect(state).toEqual({
  //         pythonLocation: "",
  //         pythonLocationValid: false,
  //         packageLocation: "/some/path"
  //       });
  //     });
  //   });
});
