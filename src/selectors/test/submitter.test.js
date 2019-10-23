import {
  instanceTypeDescriptionSelector,
  instanceTypeNamesSelector,
  selectedInstanceType,
  assetsSelector
} from "../submitter";

describe("submitter selectors", () => {
  let state = {
    submitter: {
      assets: {
        path1: { size: 10, type: "image/png" },
        path2: { size: 20, type: "image/png" },
        path3: { size: 30, type: "image/jpg" }
      },
      instanceTypeIndex: 1
    },
    entities: {
      instanceTypes: [
        {
          name: "name 1",
          description: "description 1"
        },
        {
          name: "name 2",
          description: "description 2"
        }
      ]
    }
  };

  describe("instanceType selectors", () => {
    it("returns array of descriptions", () => {
      expect(instanceTypeDescriptionSelector(state)).toEqual([
        "description 1",
        "description 2"
      ]);
    });

    it("returns array of names", () => {
      expect(instanceTypeNamesSelector(state)).toEqual(["name 1", "name 2"]);
    });

    it("returns the selected instance type", () => {
      expect(selectedInstanceType(state).name).toBe("name 2");
    });
  });

  describe("asset selectors", () => {
    it("returns array of 3 elements", () => {
      expect(assetsSelector(state)).toHaveLength(3);
    });
  });

  describe("asset selectors", () => {
    it("returns objects with a path , size, and type", () => {
      const _ = assetsSelector(state)[0];
      expect(_).toHaveProperty("path");
      expect(_).toHaveProperty("size");
      expect(_).toHaveProperty("type");
    });
  });
});
