import React from "react";
import "typeface-roboto";
import DownloaderContainer from "../downloader/DownloaderContainer";
import SignInContainer from "../account/SignInContainer";
import Layout from "./Layout";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

const App = () => (
  <Router>
    <Layout>
      <Switch>
        <Route path="/downloader" component={DownloaderContainer} />
        <Route path="/sign-in" component={SignInContainer} />
        <Redirect push to="/downloader" />
      </Switch>
    </Layout>
  </Router>
);

export default App;
