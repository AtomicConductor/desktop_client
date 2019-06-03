import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import CssBaseline from "@material-ui/core/CssBaseline";
import CtDrawer from "./CtDrawer";

import CtDownloader from "./downloader/CtDownloader";
import CtUploader from "./uploader/CtUploader";
import CtPlugins from "./plugins/CtPlugins";
import CtDashboard from "./dashboard/CtDashboard";

// import CtDownloaderAppBarContainer from "./CtDownloaderAppBarContainer";
import { BrowserRouter as Router, Route } from "react-router-dom";

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

        <Route path="/" exact component={CtDashboard} />
        <Route exact path="/downloader" component={CtDownloader} />
        <Route path="/uploader" component={CtUploader} />
        <Route path="/plugins" component={CtPlugins} />
        
      

      </div>
    </Router>
  );
}

export default CtLayout;
