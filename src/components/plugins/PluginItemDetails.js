import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles, fade } from "@material-ui/core/styles";
// import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";

import Box from "@material-ui/core/Box";
import InstallPathFieldContainer from "./InstallPathFieldContainer";

// import MoreMenuContainer from "./MoreMenuContainer";

import { LOADING_KEYS } from "../../_reducers/entities/jobs";

const useStyles = makeStyles(theme => ({
  details: {
    alignItems: "flex-start"
  },
  leftColumn: {
    flexBasis: "66.66%"
  },
  rightColumn: {
    flexGrow: 1,
    borderRight: `2px solid ${theme.palette.divider}`,
    borderLeft: `2px solid ${theme.palette.divider}`
  },

  helper: {
    borderRight: `2px solid ${theme.palette.divider}`,

    padding: theme.spacing(1, 2)
  },
  centeredBox: {
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

const ExistingFilesProgress = withStyles(
  {
    root: {
      height: 10,
      backgroundColor: fade("#000", 0.0),
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: fade("#fff", 0.2)
    }
  },
  { withTheme: true }
)(LinearProgress);

const PluginItemDetails = props => {
  const classes = useStyles();
  const {
    fetchFilesInfo,
    fileCount,
    existingFileCount,
    jobLabel,
    loadingKey
  } = props;

  /** Side effect to fetch files on first mount */
  useEffect(() => {
    fetchFilesInfo();
  }, []);

  const progress =
    existingFileCount === 0
      ? 0
      : parseInt((existingFileCount * 100) / fileCount, 10);

  if (loadingKey === LOADING_KEYS.DOWNLOAD_DETAILS) {
    return (
      <Box className={classes.centeredBox}>
        <Typography className={classes.messageText}>
          Fetching download info
        </Typography>
        <CircularProgress className={classes.progress} color="secondary" />
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Box className={classes.leftColumn}>
        <InstallPathFieldContainer jobLabel={jobLabel} />
      </Box>
      <Box className={classes.rightColumn}>
        <Tooltip title="existing files / available to download" placement="top">
          <Typography variant="h6" align="center">
            {`${existingFileCount} / ${fileCount}`}
          </Typography>
        </Tooltip>
        <ExistingFilesProgress
          color="secondary"
          variant="determinate"
          value={progress}
        />
      </Box>
    </React.Fragment>
  );
};

export default PluginItemDetails;

PluginItemDetails.propTypes = {
  // fetchFilesInfo: PropTypes.func.isRequired,
  // fileCount: PropTypes.number.isRequired,
  // existingFileCount: PropTypes.number.isRequired,
  // jobLabel: PropTypes.string.isRequired,
  // loadingKey: PropTypes.number.isRequired
};
{
  /* <MoreMenuContainer jobLabel={jobLabel} /> */
}
