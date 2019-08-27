import React from "react";
import { shallow } from "enzyme";
import Layout from "../Layout";

const setup = overrides => {
  const props = { ...overrides };
  const wrapper = shallow(<Layout {...props} />);
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
  it("match snapshot", () => {
    const wrapper = setup().wrapper;
    expect(wrapper).toMatchSnapshot();
  });
});
