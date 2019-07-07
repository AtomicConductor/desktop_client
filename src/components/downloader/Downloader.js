import React from "react";

import JobsContainer from "./JobsContainer";
import DownloaderQueue from "./DownloaderQueue";

import AppBarContainer from "./AppBarContainer";

import { Route, Switch } from "react-router-dom";

function Downloader() {
  console.log();
  return (
    <React.Fragment>
      <AppBarContainer />

      <Switch>
        <Route
          path="/downloader/jobs"
          render={props => <JobsContainer {...props} />}
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
