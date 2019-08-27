import { mapStateToProps } from "../DrawerContainer";

describe("mapStateToProps", () => {
  it("returns the profile object", () => {
    const state = { profile: "some profile" };
    const result = mapStateToProps(state);
    expect(result).toEqual({ profile: "some profile" });
  });
});
