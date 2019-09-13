import React from "react";
import "typeface-roboto";
import DownloaderContainer from "../downloader/DownloaderContainer";
import Yaml from "../yaml/Yaml";
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
        <Route path="/yaml" component={Yaml} />
        <Redirect push to="/downloader" />
        <Route path="/sign-in" component={SignInContainer} />
      </Switch>
    </Layout>
  </Router>
);

export default App;
