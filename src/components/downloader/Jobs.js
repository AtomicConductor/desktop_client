import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import FilterDrawerContainer from "./FilterDrawerContainer";
import JobItemContainer from "./JobItemContainer";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  appBarHeight,
  filterDrawerWidth,
  statusLineHeight,
  drawerWidth
} from "../../_helpers/constants";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: 2,
    marginTop: appBarHeight,
    width: `calc(100% - ${filterDrawerWidth + drawerWidth}px)`,
    overflow: "auto",
    position: "absolute",
    height: `calc(100% - ${appBarHeight + statusLineHeight}px)`
  },

  centeredBox: {
    border: "1px solid red",
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

const Jobs = props => {
  const { jobs, loading } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("panel1");

  const onPanelClick = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : "");
  };

  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(() => {
  //   setExpanded("00921");
  // }, []);

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
        <Box className={classes.listBox}>
          {jobs.map(job => (
            <JobItemContainer
              key={job.jobLabel}
              job={job}
              expanded={expanded}
              onPanelClick={onPanelClick}
            />
          ))}
        </Box>
      );
    } else {
      content = (
        <Box className={classes.centeredBox}>
          <Typography variant="h6">No jobs match the current filter</Typography>
        </Box>
      );
    }
  }

  return (
    <div>
      <Box className={classes.container}>{content}</Box>
      <FilterDrawerContainer />
    </div>
  );
};

Jobs.propTypes = {
  jobs: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Jobs;