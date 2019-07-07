import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";

import Box from "@material-ui/core/Box";
import OutputPathFieldContainer from "./OutputPathFieldContainer";
const useStyles = makeStyles(theme => ({
  details: {
    alignItems: "flex-start"
  },
  leftColumn: {
    flexBasis: "66.66%",
    borderRight: `2px solid ${theme.palette.divider}`
  },
  rightColumn: {
    // flexBasis: "66.66%",
    // border: "1px solid red",
    flexGrow: 1
    // borderRight: `2px solid ${theme.palette.divider}`
  },

  helper: {
    borderRight: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  },
  centeredBox: {
    border: "1px solid red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  }
}));

const JobItemDetails = props => {
  const classes = useStyles();
  const {
    fetchFilesInfo,
    fileCount,
    existingFileCount,
    jobLabel,
    loading
  } = props;

  /** Side effect to fetch files on first mount */
  useEffect(() => {
    fetchFilesInfo();
  }, []);

  if (loading) {
    return (
      <Box className={classes.centeredBox}>
        <CircularProgress className={classes.progress} color="secondary" />
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Box className={classes.leftColumn}>
        <OutputPathFieldContainer jobLabel={jobLabel} />
      </Box>
      <Box className={classes.rightColumn}>
        {`${existingFileCount} / ${fileCount}`}
      </Box>
    </React.Fragment>
  );
};

export default JobItemDetails;

JobItemDetails.propTypes = {
  fetchFilesInfo: PropTypes.func.isRequired,
  fileCount: PropTypes.number.isRequired,
  existingFileCount: PropTypes.number.isRequired,

  // outputPath: PropTypes.string.isRequired,
  jobLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
  //   setValue: PropTypes.func.isRequired
};

// <Typography variant="caption">
//   Select your destination of choice
//   <br />
//   <a href="#sub-labels-and-columns" className={classes.link}>
//     Learn more
//   </a>
// </Typography>;
