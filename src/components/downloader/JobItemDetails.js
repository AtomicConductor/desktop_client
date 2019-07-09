import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

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
  },
  messageText: {
    paddingRight: theme.spacing(2)
  }
}));

const JobItemDetails = props => {
  const classes = useStyles();
  const {
    fetchFilesInfo,
    fileCount,
    existingFileCount,
    jobLabel,
    loadingMessage
  } = props;

  /** Side effect to fetch files on first mount */
  useEffect(() => {
    fetchFilesInfo();
  }, []);

  if (loadingMessage.length > 0) {
    return (
      <Box className={classes.centeredBox}>
        <Typography className={classes.messageText}>
          {loadingMessage}
        </Typography>
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
        <Typography variant="h5">
          {`${existingFileCount} / ${fileCount}`}
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default JobItemDetails;

JobItemDetails.propTypes = {
  fetchFilesInfo: PropTypes.func.isRequired,
  fileCount: PropTypes.number.isRequired,
  existingFileCount: PropTypes.number.isRequired,
  jobLabel: PropTypes.string.isRequired,
  loadingMessage: PropTypes.string.isRequired
};
