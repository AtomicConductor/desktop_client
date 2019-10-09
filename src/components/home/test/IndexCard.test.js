import React from "react";

import { shallow } from "enzyme";
import IndexCard from "../IndexCard";

const setup = overrides => {
  const props = {
    onClick: jest.fn(),
    title: "Title",
    body: "Some string body",
    icon: <div />,
    ...overrides
  };

  const wrapper = shallow(<IndexCard {...props} />);

  return {
    props,
    wrapper
  };
};

it("renders without crashing", () => {
  const { wrapper } = setup();
  expect(wrapper.exists()).toBe(true);
});

describe("snapshots", () => {
  it("match snapshot default", () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });

  it("match snapshot with body element", () => {
    const { wrapper } = setup({ body: <React.Fragment>foo</React.Fragment> });
    expect(wrapper).toMatchSnapshot();
  });
});
