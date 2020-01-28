/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "typeface-roboto";
import DownloaderContainer from "../downloader/DownloaderContainer";
import Submitter from "../submitter/Submitter";
import Log from "../log/Log";

import Resources from "../resources";
import Layout from "./Layout";
import { paths } from "../../_helpers/constants";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInFromSaved } from "../../_actions/user";
import { startDownloadQueue } from "../../_actions/files";
import fetchSoftwarePackages from "../../_actions/submitter/fetchSoftwarePackages";
import signInClientTools from "../../_actions/clientTools";
import SignIn from "../account/SignIn";
import Welcome from "../welcome";
import { useLocalStorage } from "../../hooks/localStorage";
import { settings } from "../../_helpers/constants";

const { resources, downloader, submitter, log, signIn, welcome } = paths;

const App = () => {
  const dispatch = useDispatch();
  const [showWelcomePage] = useLocalStorage(settings.showWelcomePage, true);

  useEffect(() => {
    const signleSignIn = async () => {
      await dispatch(signInFromSaved());
      await dispatch(signInClientTools());
    };
    signleSignIn();
    dispatch(startDownloadQueue());
    dispatch(fetchSoftwarePackages());
  }, []);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path={resources} component={Resources} />
          <Route path={downloader} component={DownloaderContainer} />
          <Route path={submitter} component={Submitter} />
          <Route path={log} component={Log} />
          <Route path={signIn} component={SignIn} />
          <Route path={welcome} component={Welcome} />
          <Redirect push to={showWelcomePage ? welcome : resources} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
