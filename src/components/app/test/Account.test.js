import React from "react";

import { shallow } from "enzyme";
import Account from "../Account";

const setup = overrides => {
  const props = {
    email: "",
    loggedIn: false,
    accountName: ""
  };
  const wrapper = shallow(<Account {...{ ...props, ...overrides }} />);
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
