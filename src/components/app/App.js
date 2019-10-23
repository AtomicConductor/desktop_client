/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "typeface-roboto";
import DownloaderContainer from "../downloader/DownloaderContainer";
import Submitter from "../submitter/Submitter";
import Home from "../home";
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
import { fetchSoftwarePackages } from "../../_actions/submitter";

const { home, downloader, submitter } = paths;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signInFromSaved());
    dispatch(startDownloadQueue());
    dispatch(fetchSoftwarePackages());
  }, []);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path={home} component={Home} />
          <Route path={downloader} component={DownloaderContainer} />
          <Route path={submitter} component={Submitter} />
          <Redirect push to={home} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
