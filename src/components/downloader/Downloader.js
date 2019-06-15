import React from "react";

import DownloaderJobs from "./DownloaderJobs";
import DownloaderQueue from "./DownloaderQueue";

import DownloaderAppBarContainer from "./DownloaderAppBarContainer";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

function Downloader() {
  console.log();
  return (
    <React.Fragment>
      <DownloaderAppBarContainer />

      <Switch>
        <Route
          path="/downloader/jobs"
          render={props => <DownloaderJobs {...props} />}
        />
        <Route
          path="/downloader/queue"
          render={props => <DownloaderQueue {...props} />}
        />
      </Switch>
    </React.Fragment>
  );
}

export default Downloader;
