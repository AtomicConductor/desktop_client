import React from "react";
import { shallow } from "enzyme";
import CtLayout from "../CtLayout";

const setup = overrides => {
  const props = { ...overrides };
  const wrapper = shallow(<CtLayout {...props} />);
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
