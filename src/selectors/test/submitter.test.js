import { instanceTypesSelector, assetsSelector } from "../submitter";

describe("submitter selectors", () => {
  let state = {
    entities: {
      instanceTypes: [
        {
          name: "name 1",
          description: "description 1",
          cores: 2
        },
        {
          name: "name 2",
          description: "description 2",
          cores: 1
        }
      ],
      projects: ["a", "z", "b"]
    },
    submitter: {
      submission: {
        assets: {
          path1: { size: 10, type: "image/png" },
          path2: { size: 20, type: "image/png" },
          path3: { size: 30, type: "image/jpg" }
        },
        instanceType: {
          name: "name 2",
          description: "description 2",
          cores: 1
        }
      }
    }
  };

  it("returns an array of instance types sorted by cores", () => {
    expect(instanceTypesSelector(state)[0].cores).toBe(1);
  });

  it("returns array of 3 assets", () => {
    expect(assetsSelector(state)).toHaveLength(3);
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
