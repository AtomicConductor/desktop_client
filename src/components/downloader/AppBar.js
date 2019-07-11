import React from "react";
import PropTypes from "prop-types";

import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import { drawerWidth } from "../../_helpers/constants";

import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";

import SearchIcon from "@material-ui/icons/Search";

import QueueIcon from "@material-ui/icons/Queue";
import ViewListIcon from "@material-ui/icons/ViewList";

import { withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },

  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  hide: {
    display: "none"
  },

  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  }
}));

const AppBar = props => {
  const classes = useStyles();

  const { history } = props;

  const locationIsJobs = history.location.pathname !== "/downloader/queue";

  const onToggleQueue = () => {
    const url = locationIsJobs ? "/downloader/queue" : "/downloader/jobs";
    history.push(url);
  };

  return (
    <MuiAppBar position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          Downloader
        </Typography>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ "aria-label": "Search" }}
          />
        </div>
        <div className={classes.grow} />
      </Toolbar>
    </MuiAppBar>
  );
};

export { AppBar };

export default withRouter(AppBar);

// <IconButton color="inherit" onClick={onToggleQueue}>
// {locationIsJobs ? <QueueIcon /> : <ViewListIcon />}
// </IconButton>
