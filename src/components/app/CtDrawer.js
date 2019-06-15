import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CloudUpload from "@material-ui/icons/CloudUpload";
import CloudDownload from "@material-ui/icons/CloudDownload";
import DashboardIcon from "@material-ui/icons/Dashboard";

import Power from "@material-ui/icons/Power";

import HelpIcon from "@material-ui/icons/Help";
import SettingsIcon from "@material-ui/icons/Settings";

import CtDrawerMenuItem from "./CtDrawerMenuItem";
import CtDrawerAccountMenuItem from "./CtDrawerAccountMenuItem";

import "typeface-raleway";
import { drawerWidth } from "../../_helpers/constants";

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
  toolbar: {
    height: 48
  },
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
  },
  spacer: {
    display: "flex",
    flexGrow: "1",
    flexDirection: "column"
  }
}));

const CtDrawer = props => {
  const classes = useStyles();

  const { profile } = props;
  const loggedIn = !!Object.entries(profile.user).length && !!profile.user.data;

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
      <List className={classes.list}>
        <CtDrawerMenuItem
          url="/dashboard"
          text_props={{
            primary: "Dashboard"
          }}
          icon={<DashboardIcon />}
        />
        <CtDrawerMenuItem
          url="/downloader/jobs"
          text_props={{
            primary: "Downloader"
          }}
          icon={<CloudDownload />}
        />
        <CtDrawerMenuItem
          url="/uploader"
          text_props={{
            primary: "Uploader"
          }}
          icon={<CloudUpload />}
        />
        <CtDrawerMenuItem
          url="/plugins"
          text_props={{
            primary: "Plugins"
          }}
          icon={<Power />}
        />

        <CtDrawerMenuItem
          text_props={{
            primary: "Settings"
          }}
          url="/settings"
          label="Settings"
          icon={<SettingsIcon />}
        />

        <ListItem dense>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>

        <Divider />
      </List>

      <CtDrawerAccountMenuItem
        currentUser={loggedIn ? profile.user.data : {}}
      />
    </Drawer>
  );
};

CtDrawer.propTypes = {
  profile: PropTypes.object.isRequired
};

export default CtDrawer;
