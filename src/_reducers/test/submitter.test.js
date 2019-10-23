import reducer from "../submitter";
import { updateSelectedSoftware } from "../../_actions/submitter";

describe("submitter reducer", () => {
  describe("software packages", () => {
    it("adds a new entry", () => {
      const initialState = {
        softwarePackages: [{}]
      };

      const state = reducer(initialState, updateSelectedSoftware({}));

      expect(state).toEqual({ softwarePackages: [{}, {}] });
    });

    it("updates an existing entry", () => {
      const initialState = {
        softwarePackages: [{}, {}, {}]
      };

      const state = reducer(
        initialState,
        updateSelectedSoftware({
          index: 2,
          softwareKey: "maya",
          package: "1234567890"
        })
      );

      expect(state).toEqual({
        softwarePackages: [
          {},
          {},
          { softwareKey: "maya", package: "1234567890" }
        ]
      });
    });

    it("removes an existing entry", () => {
      const initialState = {
        softwarePackages: [{}, { softwareKey: "key", package: "id" }]
      };

      const state = reducer(
        initialState,
        updateSelectedSoftware({
          index: 1,
          softwareKey: undefined,
          package: undefined
        })
      );

      expect(state).toEqual({ softwarePackages: [{}] });
    });
  });
});
