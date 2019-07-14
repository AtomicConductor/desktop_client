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

import { LOADING_KEYS } from "../../_reducers/entities/jobs";

const useStyles = makeStyles(theme => ({}));

const MoreMenu = props => {
  const classes = useStyles();

  const {
    // fetchFilesInfo,
    viewInFinder,
    refreshAll,
    refreshExistingFiles,
    resetOutputDirectory
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  const handleResetOutputDirectory = () => {
    setAnchorEl(null);
    resetOutputDirectory();
  };

  const handleRefreshExistingFiles = () => {
    setAnchorEl(null);
    refreshExistingFiles();
  };

  const handleRefreshAll = () => {
    setAnchorEl(null);
    refreshAll();
  };

  const handleViewInFinder = () => {
    setAnchorEl(null);
    viewInFinder();
  };

  return (
    <React.Fragment>
      <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
        <MoreIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRefreshAll}>Refresh all</MenuItem>
        <MenuItem onClick={handleRefreshExistingFiles}>
          Refresh existing files
        </MenuItem>
        <MenuItem onClick={handleResetOutputDirectory}>
          Reset output directory
        </MenuItem>
        <MenuItem onClick={handleViewInFinder}>View in finder</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default MoreMenu;

MoreMenu.propTypes = {
  resetOutputDirectory: PropTypes.func.isRequired,
  refreshExistingFiles: PropTypes.func.isRequired,
  refreshAll: PropTypes.func.isRequired,
  viewInFinder: PropTypes.func.isRequired
  // existingFileCount: PropTypes.number.isRequired,
  // jobLabel: PropTypes.string.isRequired,
  // loadingKey: PropTypes.number.isRequired
};
