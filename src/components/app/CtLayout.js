import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import CtDrawerContainer from "./CtDrawerContainer";
import Downloader from "../downloader/Downloader";
import CtUploader from "../uploader/CtUploader";
import CtPlugins from "../plugins/CtPlugins";
import CtAccountContainer from "../account/CtAccountContainer";

import CtDashboard from "../dashboard/CtDashboard";
import CtSettings from "../settings/CtSettings";

import CtSnackbarContainer from "../notification/CtSnackbarContainer";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  }
}));

const CtLayout = () => {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <CtDrawerContainer />

        <Switch>
          <Route
            path="/dashboard"
            render={props => <CtDashboard {...props} />}
          />
          <Route
            path="/downloader/jobs"
            render={props => <Downloader {...props} />}
          />
          <Route
            path="/downloader/queue"
            render={props => <Downloader {...props} />}
          />
          <Route
            path="/downloader"
            render={props => <Downloader {...props} />}
          />
          <Route path="/uploader" render={props => <CtUploader {...props} />} />
          <Route path="/plugins" render={props => <CtPlugins {...props} />} />
          <Route path="/settings" render={props => <CtSettings {...props} />} />
          <Route
            path="/account"
            render={props => <CtAccountContainer {...props} />}
          />

          <Redirect push to="/dashboard" />
        </Switch>
      </div>
      <CtSnackbarContainer />
    </Router>
  );
};

export default CtLayout;
