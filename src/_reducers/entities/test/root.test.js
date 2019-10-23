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
      }
    });
  });
});
