import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import CtDrawer from "./CtDrawer";
import CtDownloader from "./downloader/CtDownloader";
import CtUploader from "./uploader/CtUploader";
import CtPlugins from "./plugins/CtPlugins";
import CtDashboard from "./dashboard/CtDashboard";
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

function CtLayout() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <CtDrawer />
        <Switch>
          <Route
            path="/dashboard"
            render={props => <CtDashboard {...props} />}
          />
          <Route
            path="/downloader"
            render={props => <CtDownloader {...props} />}
          />
          <Route
            path="/uploader"
            render={props => <CtUploader {...props} />}
          />
          <Route
            path="/plugins"
            render={props => <CtPlugins {...props} />}
          />
          <Redirect push to="/dashboard" />
        </Switch>
      </div>
    </Router>
  );
}

export default CtLayout;
