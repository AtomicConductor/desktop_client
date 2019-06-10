import React from "react";

import { shallow } from "enzyme";
import { CtDrawerAccountMenuItem } from "../CtDrawerAccountMenuItem";

const setup = overrides => {
  const props = {
    history: { location: { pathname: "/some/path" } },
    currentUser: { email: null },
    ...overrides
  };
  const wrapper = shallow(<CtDrawerAccountMenuItem {...props} />);
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
  it("match snapshot when currentUser has an email", () => {
    const wrapper = setup({ currentUser: { email: "test@conductotrio.com" } })
      .wrapper;
    expect(wrapper).toMatchSnapshot();
  });

  it("match snapshot when currentUser has no email", () => {
    const wrapper = setup({ currentUser: { email: "" } }).wrapper;
    expect(wrapper).toMatchSnapshot();
  });
});
