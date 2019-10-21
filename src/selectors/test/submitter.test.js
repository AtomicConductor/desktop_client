import { instanceTypeDescriptions } from "../submitter";
import { instanceTypeNames } from "../submitter";

describe("submitter selectors", () => {
  let state = {
    submitter: {
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
      expect(instanceTypeDescriptions(state)).toEqual([
        "description 1",
        "description 2"
      ]);
    });

    it("returns array of names", () => {
      expect(instanceTypeNames(state)).toEqual(["name 1", "name 2"]);
    });
  });
});
