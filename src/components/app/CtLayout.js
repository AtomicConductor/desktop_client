/* 
Manage high level layout of page.

All top level components exist here.
Main box

Drawer
Status line
Snackbars
Modals

The main box also contains the router.
Other elements live outside the router. 
*/

import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

import CtDrawerContainer from "./CtDrawerContainer";
import Downloader from "../downloader/Downloader";
import CtUploader from "../uploader/CtUploader";
import CtPlugins from "../plugins/CtPlugins";
import CtAccountContainer from "../account/CtAccountContainer";

import CtDashboard from "../dashboard/CtDashboard";
import CtSettings from "../settings/CtSettings";
import StatusLine from "./StatusLine";

import CtSnackbarContainer from "../notification/CtSnackbarContainer";
import { drawerWidth, statusLineHeight } from "../../_helpers/constants";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  box: {
    // border: "1px solid #0f0",
    height: window.innerHeight - statusLineHeight,
    marginLeft: drawerWidth
  }
}));

const CtLayout = () => {
  const classes = useStyles();

  return (
    <Router>
      <CtDrawerContainer />
      <Box className={classes.box}>
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
      </Box>
      <CtSnackbarContainer />
      <StatusLine />
    </Router>
  );
};

export default CtLayout;
