import reducer from "../submitter";
import { updateSelectedSoftware } from "../../_actions/submitter";

describe("submitter reducer", () => {
  describe("software packages", () => {
    it("updates an existing entry", () => {
      const initialState = {
        submission: { softwarePackages: [{ softwareKey: "", package: {} }] }
      };

      const state = reducer(
        initialState,
        updateSelectedSoftware({
          index: 0,
          softwareKey: "maya",
          package: "1234567890"
        })
      );

      expect(state).toEqual({
        submission: {
          softwarePackages: [
            { softwareKey: "maya", package: "1234567890" },
            { softwareKey: "", package: {} }
          ]
        }
      });
    });

    it("removes an existing entry", () => {
      const initialState = {
        submission: {
          softwarePackages: [
            { softwareKey: "key1", package: "id1" },
            { softwareKey: "key2", package: "id2" }
          ]
        }
      };

      const removeItem = (state, index) =>
        reducer(
          state,
          updateSelectedSoftware({
            index,
            softwareKey: "",
            package: ""
          })
        );

      let state = removeItem(initialState, 0);
      state = removeItem(state, 0);

      expect(state).toEqual({
        submission: { softwarePackages: [{ softwareKey: "", package: {} }] }
      });
    });
  });
});
