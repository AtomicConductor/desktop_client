import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Menu,
  MenuItem
} from "@material-ui/core";
import MuiAppBar from "@material-ui/core/AppBar";
import { drawerWidth } from "../../_helpers/constants";
import { useSelector, useDispatch } from "react-redux";

import MoreIcon from "@material-ui/icons/MoreVert";

import {
  saveSubmission,
  loadSubmission,
  applyResetSubmission
} from "../../_actions/submitter";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },

  title: {
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  }
}));

const AppBar = props => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filename = useSelector(state => state.submitter.filename);

  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  const handleSave = () => {
    setAnchorEl(null);
    dispatch(saveSubmission(filename));
  };
  const handleSaveAs = e => {
    if (e.target.files && e.target.files[0]) {
      dispatch(saveSubmission(e.target.files[0].path));
    }
    // We reset the value because otherwise the second and subsequent times
    // we browse, nothing will happen, because nothing chnaged.
    e.target.value = "";
  };

  const handleLoad = e => {
    if (e.target.files && e.target.files[0]) {
      dispatch(loadSubmission(e.target.files[0].path));
    }
    e.target.value = "";

    setAnchorEl(null);
  };

  const handleReset = e => {
    dispatch(applyResetSubmission());
    setAnchorEl(null);
  };

  return (
    <MuiAppBar position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          Submission Kit
        </Typography>

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
          <input
            className={classes.input}
            style={{ display: "none" }}
            id="load-submission-file"
            type="file"
            onChange={handleLoad}
          />
          <label htmlFor="load-submission-file">
            <MenuItem onClick={handleMenuClose}>Load</MenuItem>
          </label>

          <MenuItem onClick={handleSave} disabled={!Boolean(filename)}>
            Save
          </MenuItem>
          <input
            nwsaveas="filename.json"
            className={classes.input}
            style={{ display: "none" }}
            id="save-submission-file"
            type="file"
            onChange={handleSaveAs}
          />
          <label htmlFor="save-submission-file">
            <MenuItem onClick={handleMenuClose}>Save As</MenuItem>
          </label>
          <Divider />
          <MenuItem onClick={handleReset}>Reset</MenuItem>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
