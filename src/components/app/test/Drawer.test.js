import React from "react";

import { shallow } from "enzyme";
import Drawer from "../Drawer";

const setup = overrides => {
  const props = { email: 'foo@bar', accountName: "my account", loggedIn: true };
  const wrapper = shallow(<Drawer {...{...props, ...overrides}} />);
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
  it("match snapshot when user is not logged in", () => {
    const wrapper = setup({ loggedIn: false })
      .wrapper;
    expect(wrapper).toMatchSnapshot();
  });

  it("match snapshot when user is logged in", () => {
    const wrapper = setup().wrapper;
    expect(wrapper).toMatchSnapshot();
  });
});
