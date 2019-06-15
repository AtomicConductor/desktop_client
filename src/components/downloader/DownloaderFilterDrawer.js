import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";

import Divider from "@material-ui/core/Divider";

import ListItem from "@material-ui/core/ListItem";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Switch from "@material-ui/core/Switch";

import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormJobFieldContainer from "./FormJobFieldContainer";
import FormTaskFieldContainer from "./FormTaskFieldContainer";

import FormOutputPathFieldContainer from "./FormOutputPathFieldContainer";

const drawerWidth = 440;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },
  title: {
    flexGrow: 1
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    // marginTop:  '80px',
    ...{ height: 48 },
    justifyContent: "flex-start"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },
  button: {
    margin: theme.spacing(1)
  },
  box: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 8,
    marginTop: 16
  }
}));

const DownloaderFilterDrawer = props => {
  const classes = useStyles();

  const {
    drawerIsOpen,
    useDaemon,
    onToggleUseDaemon,
    run,
    refreshJobList
  } = props;

  const handleSelectDirectory = event => {
    console.log(event.target.files);
  };

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerIsOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader} />
        <Divider />

        <List>
          <ListItem divider>
            <ListItemText primary="Use Daemon" />
            <ListItemSecondaryAction>
              <Switch checked={useDaemon} onChange={onToggleUseDaemon} />
            </ListItemSecondaryAction>
          </ListItem>

          <FormTaskFieldContainer disabled={useDaemon} />
          <FormJobFieldContainer disabled={useDaemon} />
          <FormOutputPathFieldContainer disabled={useDaemon} />

          <Box className={classes.box}>
            <Button
              disabled={useDaemon}
              variant="outlined"
              className={classes.button}
              color="secondary"
              onClick={refreshJobList}
            >
              Download
            </Button>
          </Box>
        </List>
      </Drawer>
    </div>
  );
};

DownloaderFilterDrawer.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired,
  useDaemon: PropTypes.bool.isRequired,
  onToggleUseDaemon: PropTypes.func.isRequired,
  run: PropTypes.func.isRequired,
  refreshJobList: PropTypes.func.isRequired
};

export default DownloaderFilterDrawer;
