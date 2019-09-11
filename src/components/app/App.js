import React from "react";
import "typeface-roboto";
import DownloaderContainer from "../downloader/DownloaderContainer";
import Yaml from "../yaml/Yaml";
import AccountContainer from "../account/AccountContainer";
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
        <Route path="/account" component={AccountContainer} />
        <Redirect push to="/downloader" />
      </Switch>
    </Layout>
  </Router>
);

export default App;
