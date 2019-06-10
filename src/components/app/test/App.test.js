import React from "react";

import { shallow } from "enzyme";
import App from "../App";

it("renders without crashing", () => {
  shallow(<App />);
});

describe("snapshots", () => {
  it("match snapshot when status is success", () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });
});
