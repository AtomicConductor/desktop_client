import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CloudUpload from "@material-ui/icons/CloudUpload";
import CloudDownload from "@material-ui/icons/CloudDownload";
import Power from "@material-ui/icons/Power";

import ListIcon from "@material-ui/icons/List";
import HelpIcon from "@material-ui/icons/Help";


import "typeface-raleway";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },

  logo: {
    fontFamily: "Raleway",
    fontSize: 24,
    textAlign: "center",
    margin: "auto",
    fontWeight: 500,

    verticalAlign: "middle",
    m: 1
  }
}));

function CtDrawer() {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
      anchor="left"
    >
      <ListItem className={classes.toolbar}>
        <Typography className={classes.logo}>CONDUCTOR</Typography>
      </ListItem>

      <Divider />
      <List>
        <ListItem button key="Login" dense>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <Divider />
        <ListItem button key="Downloader" dense selected>
          <ListItemIcon>
            <CloudDownload />
          </ListItemIcon>
          <ListItemText primary="Downloader" />
        </ListItem>
        <ListItem button key="Uploader" dense>
          <ListItemIcon>
            <CloudUpload />
          </ListItemIcon>
          <ListItemText primary="Uploader" />
        </ListItem>
        <ListItem button key="Plugins" dense>
          <ListItemIcon>
            <Power />
          </ListItemIcon>
          <ListItemText primary="Plugins" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="Logs" dense>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Logs" />
        </ListItem>

        <ListItem button key="Help" dense>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
      </List>
    </Drawer>
  );
}



export default CtDrawer;
