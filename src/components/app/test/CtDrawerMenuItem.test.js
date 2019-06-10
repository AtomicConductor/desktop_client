import React from "react";
import { shallow } from "enzyme";
import { CtDrawerMenuItem } from "../CtDrawerMenuItem";

const setup = overrides => {
  const props = {
    history: { location: { pathname: "/some/pathname" } },
    url: "/some/url",
    text_props: {},
    icon: <div />,
    ...overrides
  };

  const wrapper = shallow(<CtDrawerMenuItem {...props} />);
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
  it("match snapshot when pathname is not url", () => {
    const wrapper = setup().wrapper;
    expect(wrapper).toMatchSnapshot();
  });

  it("match snapshot when pathname is url", () => {
    const wrapper = setup({
      history: { location: { pathname: "/some/place" } },
      url: "/some/place"
    }).wrapper;
    expect(wrapper).toMatchSnapshot();
  });
});
