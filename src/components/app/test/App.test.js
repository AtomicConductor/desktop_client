import React from "react";

import { shallow } from "enzyme";
import App from "../App";
import { Provider } from 'react-redux';
import mockReduxStore from 'redux-mock-store';

describe('<App />', () => {
  let app;
  beforeEach(() => {
    const store = mockReduxStore()({});
    app =
      <Provider store={store}>
        <App />
      </Provider>;
  })
  it("renders without crashing", () => {
    shallow(app);
  });

  describe("snapshots", () => {
    it("match snapshot when status is success", () => {
      expect(shallow(app)).toMatchSnapshot();
    });
  });
});