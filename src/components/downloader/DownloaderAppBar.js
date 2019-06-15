import React from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import MenuIcon from "@material-ui/icons/Menu";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import IconButton from '@material-ui/icons/IconButton';
import IconButton from "@material-ui/core/IconButton";
import { drawerWidth } from "../../_helpers/constants";

import DownloaderTabs from "./DownloaderTabs";

import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";

import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import FilterListIcon from "@material-ui/icons/FilterList";
import QueueIcon from "@material-ui/icons/Queue";
import ViewListIcon from "@material-ui/icons/ViewList";

import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    // flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    zIndex: 1301
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

const DownloaderAppBar = props => {
  const classes = useStyles();

  const { drawerIsOpen, onToggleDrawer, history } = props;

  const locationIsJobs = history.location.pathname !== "/downloader/queue";

  const onToggleQueue = () => {
    const url = locationIsJobs ? "/downloader/queue" : "/downloader/jobs";
    history.push(url);
  };
  const onGoQueue = () => {
    const url = "/downloader/queue";
    history.push(url);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
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

        <IconButton color="inherit" onClick={onToggleQueue}>
          {locationIsJobs ? <QueueIcon /> : <ViewListIcon />}
        </IconButton>

        <IconButton color="inherit" />

        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="end"
          // className={clsx(open && classes.hide)}
          onClick={onToggleDrawer}
        >
          <FilterListIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

DownloaderAppBar.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired,
  onToggleDrawer: PropTypes.func.isRequired
};

// <Badge badgeContent={17} color="secondary">
// <NotificationsIcon />
// </Badge>

DownloaderAppBar.defaultProps = {
  drawerIsOpen: false
};

export { DownloaderAppBar };

export default withRouter(DownloaderAppBar);
