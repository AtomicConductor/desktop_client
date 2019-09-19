/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import PropTypes from "prop-types";

import AppBarContainer from "./AppBarContainer";
import SignInContainer from "../account/SignInContainer";
import { makeStyles } from "@material-ui/core/styles";
import JobItemContainer from "./JobItemContainer";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core";

import { appBarHeight } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  container: {
    padding: 2,
    marginTop: appBarHeight,
    width: "100%",
    overflow: "auto",
    position: "absolute",
    height: `calc(100% - ${appBarHeight}px)`
  },

  centeredBox: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },

  progress: {
    margin: "auto"
  }
}));

const Downloader = props => {
  const { jobs, loading, fetchJobs, loggedIn } = props;
  if (!loggedIn) {
    return <SignInContainer />;
  }
  const classes = useStyles();

  useEffect(() => {
    fetchJobs();
  }, []);

  let content;
  if (loading) {
    content = (
      <Box className={classes.centeredBox}>
        <CircularProgress className={classes.progress} color="secondary" />
      </Box>
    );
  } else {
    if (jobs.length) {
      content = (
        <Box>
          {jobs.map(job => (
            <JobItemContainer key={job.jobLabel} job={job} />
          ))}
        </Box>
      );
    } else {
      content = (
        <Box className={classes.centeredBox}>
          <Typography variant="h6">
            No jobs match the current filters.
          </Typography>
          <Typography>Try changing the date range.</Typography>
        </Box>
      );
    }
  }

  return (
    <React.Fragment>
      <AppBarContainer />
      <Box className={classes.container}>{content}</Box>;
    </React.Fragment>
  );
};

Downloader.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  jobs: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchJobs: PropTypes.func.isRequired
};

export default Downloader;
