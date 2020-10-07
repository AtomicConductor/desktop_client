import {
  //   itemsSelector,
  //   installingSelector,
  //   helpOpenSelector,
  pkgsArraySelector,
  pkgNamesArraySelector,
  packageNameSelector,
  helpItemSelector
} from "../plugins";

const stateSetup = (overrides = {}, itemOverrides = {}) => ({
  plugins: {
    installing: null,
    helpOpen: false,
    items: {
      ...itemOverrides
    },
    ...overrides
  }
});
describe("plugin selectors", () => {
  describe("pkgsArraySelector", () => {
    it("returns items as an ordered array", () => {
      const state = stateSetup(
        {},
        { a: { order: 1 }, b: { order: 3 }, c: { order: 2 } }
      );
      expect(pkgsArraySelector(state)).toEqual(
        expect.arrayContaining([{ order: 1 }])
      );
      expect(pkgsArraySelector(state)).toEqual([
        { order: 1 },
        { order: 2 },
        { order: 3 }
      ]);
    });
  });

  describe("pkgNamesArraySelector", () => {
    it("returns names according to order", () => {
      const state = stateSetup(
        {},
        {
          a: { order: 1, name: "a" },
          b: { order: 3, name: "b" },
          c: { order: 2, name: "c" }
        }
      );
      expect(pkgNamesArraySelector(state)).toEqual(["a", "c", "b"]);
    });
  });

  describe("packageNameSelector", () => {
    it("returns name when installing and available", () => {
      const state = stateSetup(
        { installing: "a" },
        { a: { order: 1, name: "a", available: "pip", packageName: "pkga" } }
      );
      expect(packageNameSelector(state)).toEqual("pkga");
    });
    it("returns false when installing and unavailable", () => {
      const state = stateSetup(
        { installing: "a" },
        { a: { order: 1, name: "a", available: false, packageName: "pkga" } }
      );
      expect(packageNameSelector(state)).toBeFalsy();
    });
    it("returns false when not installing", () => {
      const state = stateSetup(
        { installing: null },
        { a: { order: 1, name: "a", available: "pip", packageName: "pkga" } }
      );
      expect(packageNameSelector(state)).toBeFalsy();
    });
  });

  describe("helpItemSelector", () => {
    it("returns object containing item for which helpOpen is set", () => {
      const state = stateSetup(
        { helpOpen: "a" },
        { a: { order: 1, name: "a", available: "pip", packageName: "pkga" } }
      );
      state.settings = { pythonLocationValid: true, packageLocation: "foo" };
      expect(helpItemSelector(state)).toEqual(
        expect.objectContaining({ name: "a" })
      );
    });
    it("returns object containing packageLocation", () => {
      const state = stateSetup(
        { helpOpen: "a" },
        { a: { order: 1, name: "a", available: "pip", packageName: "pkga" } }
      );
      state.settings = { pythonLocationValid: true, packageLocation: "foo" };
      expect(helpItemSelector(state)).toEqual(
        expect.objectContaining({ packageLocation: "foo" })
      );
    });

    it("returns null when helpOpen is not set", () => {
      const state = stateSetup(
        { helpOpen: null },
        { a: { order: 1, name: "a", available: "pip", packageName: "pkga" } }
      );
      state.settings = { pythonLocationValid: true, packageLocation: "foo" };
      expect(helpItemSelector(state)).toBeFalsy();
    });
  });
});
