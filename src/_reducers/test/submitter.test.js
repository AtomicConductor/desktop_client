import reducer from "../submitter";
import { updateSelectedSoftware } from "../../_actions/submitter";

describe("submitter reducer", () => {
  describe("software packages", () => {
    it("adds a new entry", () => {
      const initialState = {
        submission: {
          softwarePackages: [{}]
        }
      };

      const state = reducer(initialState, updateSelectedSoftware({}));

      expect(state).toEqual({
        submission: {
          softwarePackages: [{}, { softwareKey: "", package: {} }]
        }
      });
    });

    it("updates an existing entry", () => {
      const initialState = {
        submission: { softwarePackages: [{}, {}, {}] }
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
        submission: {
          softwarePackages: [
            {},
            {},
            { softwareKey: "maya", package: "1234567890" }
          ]
        }
      });
    });

    it("removes an existing entry", () => {
      const initialState = {
        submission: {
          softwarePackages: [{}, { softwareKey: "key", package: "id" }]
        }
      };

      const state = reducer(
        initialState,
        updateSelectedSoftware({
          index: 1,
          softwareKey: "",
          package: ""
        })
      );

      expect(state).toEqual({ submission: { softwarePackages: [{}] } });
    });
  });
});
