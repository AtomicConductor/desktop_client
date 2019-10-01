import React from "react";
import "typeface-roboto";
import DownloaderContainer from "../downloader/DownloaderContainer";
import SignInContainer from "../account/SignInContainer";
import Home from './home';
import Layout from "./Layout";
import { paths } from '../../_helpers/constants';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

const { home, downloader, signIn } = paths;

const App = () => (
  <Router>
    <Layout>
      <Switch>
        <Route path={home} component={Home} />
        <Route path={downloader} component={DownloaderContainer} />
        <Route path={signIn} component={SignInContainer} />
        <Redirect push to={home} />
      </Switch>
    </Layout>
  </Router>
);

export default App;
