import entities from "../root";
import { softwarePackagesSuccess } from "../../../_actions/submitter";

describe("entities reducer", () => {
  it("updates software packages state", () => {
    const action = softwarePackagesSuccess({ software: { packages: [] } });

    const state = entities({ softwarePackages: undefined }, action);

    expect(state).toEqual({
      jobs: {},
      instanceTypes: {},
      softwarePackages: {
        software: { packages: [] }
      },
      projects: [],
      presets: {
        "preset 1": { command: "this is a preset command 1", readonly: true },
        "preset 2": { command: "this is a preset command 2", readonly: true }
      }
    });
  });
});
