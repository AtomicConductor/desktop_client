import React from "react";
import PropTypes from "prop-types";

import MoreIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const MoreMenu = props => {
  const {
    viewInFinder,
    refreshAll,
    resetOutputDirectory,
    directoryResettable
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

        <MenuItem
          disabled={!directoryResettable}
          onClick={handleResetOutputDirectory}
        >
          Reset output directory
        </MenuItem>
        <MenuItem onClick={handleViewInFinder}>View in finder</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default MoreMenu;

MoreMenu.propTypes = {
  directoryResettable: PropTypes.bool.isRequired,
  resetOutputDirectory: PropTypes.func.isRequired,
  refreshAll: PropTypes.func.isRequired,
  viewInFinder: PropTypes.func.isRequired
};
