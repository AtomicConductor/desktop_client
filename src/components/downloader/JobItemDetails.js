import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles, fade } from "@material-ui/core/styles";
// import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";

import Box from "@material-ui/core/Box";
import OutputPathFieldContainer from "./OutputPathFieldContainer";
import MoreIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import MoreMenuContainer from "./MoreMenuContainer";

import { LOADING_KEYS } from "../../_reducers/entities/jobs";

const useStyles = makeStyles(theme => ({
  details: {
    alignItems: "flex-start"
  },
  leftColumn: {
    flexBasis: "66.66%"
  },
  rightColumn: {
    // flexBasis: "66.66%",
    // border: "1px solid red",
    flexGrow: 1,
    // borderRight: `2px solid ${theme.palette.divider}`

    borderRight: `2px solid ${theme.palette.divider}`,
    borderLeft: `2px solid ${theme.palette.divider}`
  },

  helper: {
    borderRight: `2px solid ${theme.palette.divider}`,

    padding: theme.spacing(1, 2)
  },
  centeredBox: {
    // border: "1px solid red",
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
    },
    bar: {
      // backgroundColor: "#ff6c5c"
    }
  },
  { withTheme: true }
)(LinearProgress);

const JobItemDetails = props => {
  const classes = useStyles();
  const {
    fetchFilesInfo,
    fileCount,
    existingFileCount,
    jobLabel,
    loadingKey
  } = props;

  // const [anchorEl, setAnchorEl] = React.useState(null);

  // function handleMenuOpen(event) {
  //   setAnchorEl(event.currentTarget);
  // }

  // function handleMenuClose() {
  //   setAnchorEl(null);
  // }

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
        <OutputPathFieldContainer jobLabel={jobLabel} />
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

      <MoreMenuContainer jobLabel={jobLabel} />
    </React.Fragment>
  );
};

export default JobItemDetails;

JobItemDetails.propTypes = {
  fetchFilesInfo: PropTypes.func.isRequired,
  fileCount: PropTypes.number.isRequired,
  existingFileCount: PropTypes.number.isRequired,
  jobLabel: PropTypes.string.isRequired,
  loadingKey: PropTypes.number.isRequired
};
