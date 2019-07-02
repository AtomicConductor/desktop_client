import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import Box from "@material-ui/core/Box";
import OutputPathField from "./OutputPathField";
const useStyles = makeStyles(theme => ({
  details: {
    alignItems: "flex-start"
  },
  leftColumn: {
    flexBasis: "66.66%",
    // border: "1px solid red",
    borderRight: `2px solid ${theme.palette.divider}`
  },
  rightColumn: {
    // flexBasis: "66.66%",
    // border: "1px solid red",
    // borderRight: `2px solid ${theme.palette.divider}`
  },

  helper: {
    borderRight: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  }
}));

const DownloaderJobItemDetails = props => {
  const classes = useStyles();
  const { fetchFilesInfo, job } = props;

  useEffect(() => {
    fetchFilesInfo();
  }, []);

  return (
    <React.Fragment>
      <Box className={classes.leftColumn}>
        <OutputPathField />
      </Box>
      <Box className={classes.rightColumn}>Hello</Box>
    </React.Fragment>
  );
};

export default DownloaderJobItemDetails;

DownloaderJobItemDetails.propTypes = {
  fetchFilesInfo: PropTypes.func.isRequired
  //   setValue: PropTypes.func.isRequired
};

// <Typography variant="caption">
//   Select your destination of choice
//   <br />
//   <a href="#sub-labels-and-columns" className={classes.link}>
//     Learn more
//   </a>
// </Typography>;
