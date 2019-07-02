import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";

import SyncIcon from "@material-ui/icons/Sync";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import Box from "@material-ui/core/Box";
import Switch from "@material-ui/core/Switch";
import Paper from "@material-ui/core/Paper";

import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import {
  filterDrawerWidth,
  appBarHeight,
  statusLineHeight
} from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    // border: "1px solid yellow",
    width: filterDrawerWidth,
    position: "absolute",
    right: 0,
    top: 0,
    marginTop: appBarHeight,
    height: `calc(100% - ${appBarHeight + statusLineHeight}px)`
  },

  button: {
    margin: theme.spacing(1)
  },

  paper: {
    height: "100%"
  }
}));

const DownloaderFilterDrawer = props => {
  const classes = useStyles();

  const {
    // drawerIsOpen,
    useDaemon,
    onToggleUseDaemon,
    downloadNext,
    refreshJobList
  } = props;

  // const handleSelectDirectory = event => {
  //   console.log(event.target.files);
  // };
  // const onSync = () => {
  //   console.log("sync button");
  // };
  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <List>
          <ListItem button divider onClick={refreshJobList}>
            <ListItemIcon>
              <SyncIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Sync jobs" />
          </ListItem>

          <ListItem button divider onClick={downloadNext}>
            <ListItemIcon>
              <SyncIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Download next" />
          </ListItem>

          <ListItem divider>
            <ListItemText primary="Use Daemon" />
            <ListItemSecondaryAction>
              <Switch checked={useDaemon} onChange={onToggleUseDaemon} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

DownloaderFilterDrawer.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired,
  useDaemon: PropTypes.bool.isRequired,
  onToggleUseDaemon: PropTypes.func.isRequired,
  refreshJobList: PropTypes.func.isRequired
  // downloadNext: PropTypes.func.isRequired
};

export default DownloaderFilterDrawer;

/* 
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
</Box>; 
*/

// <FormTaskFieldContainer disabled={useDaemon} />
// <FormJobFieldContainer disabled={useDaemon} />
// <FormOutputPathFieldContainer disabled={useDaemon} />

// <Drawer
// className={classes.drawer}
// variant="persistent"
// anchor="right"
// open={drawerIsOpen}
// classes={{
//   paper: classes.drawerPaper
// }}
// >

// </Drawer>
