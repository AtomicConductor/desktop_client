import React from "react";

import { shallow } from "enzyme";
import CtDrawer from "../CtDrawer";

const setup = overrides => {
  const props = { profile: { user: {} }, ...overrides };
  const wrapper = shallow(<CtDrawer {...props} />);
  return {
    props,
    wrapper
  };
};

it("renders without crashing", () => {
  const wrapper = setup().wrapper;
  expect(wrapper.exists()).toBe(true);
});

describe("snapshots", () => {
  it("match snapshot when profile is valid", () => {
    const wrapper = setup({ profile: { user: { data: { email: "foo@bar" } } } })
      .wrapper;
    expect(wrapper).toMatchSnapshot();
  });

  it("match snapshot when profile is invalid", () => {
    const wrapper = setup().wrapper;
    expect(wrapper).toMatchSnapshot();
  });
});
