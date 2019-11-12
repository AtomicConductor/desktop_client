import entities from "../root";
import { softwarePackagesSuccess } from "../../../_actions/submitter";
import { loadPresetsSuccess, selectPreset } from "../../../_actions/entities";

describe("entities reducer", () => {
  it("returns initial state for unknown actions", () => {
    const state = entities({}, { type: "UNKNOW" });

    expect(state).toMatchObject({
      jobs: {},
      softwarePackages: {},
      instanceTypes: {},
      projects: [],
      presets: {
        "simple modo": { readonly: true },
        "simple silhouette": { readonly: true }
      }
    });
  });

  describe("softwarePackages", () => {
    it("updates software packages state", () => {
      const action = softwarePackagesSuccess({ software: { packages: [] } });

      const state = entities({ softwarePackages: undefined }, action);

      expect(state.softwarePackages).toEqual({
        software: { packages: [] }
      });
    });
  });

  describe("presets", () => {
    it("appends loaded presets to state", () => {
      const action = loadPresetsSuccess({
        "my preset": "my custom command"
      });

      const state = entities({}, action);

      expect(state.presets).toEqual(
        expect.objectContaining({ "my preset": "my custom command" })
      );
    });

    it("selects a preset", () => {
      const action = selectPreset("simple silhouette");

      const state = entities({}, action);

      expect(state.presets).toMatchObject({
        "simple modo": {
          readonly: true,
          selected: false
        },
        "simple silhouette": {
          readonly: true,
          selected: true
        }
      });
    });
  });
});
