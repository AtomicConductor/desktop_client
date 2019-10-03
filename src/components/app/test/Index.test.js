import React from "react";

import { shallow } from "enzyme";
import Index from "../home/index";

it("renders without crashing", () => {
  shallow(<Index />);
});

describe("snapshots", () => {
  it("match snapshot when status is success", () => {
    expect(shallow(<Index />)).toMatchSnapshot();
  });
});
