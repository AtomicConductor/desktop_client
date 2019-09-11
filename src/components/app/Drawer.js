import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import MuiDrawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CloudDownload from "@material-ui/icons/CloudDownload";
import NotesIcon from "@material-ui/icons/Notes";
import HelpIcon from "@material-ui/icons/Help";
import DrawerMenuItem from "./DrawerMenuItem";
import DrawerAccountMenuItemContainer from "./DrawerAccountMenuItemContainer";

import "typeface-raleway";
import { drawerWidth } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
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

const Drawer = () => {
  const classes = useStyles();

  return (
    <MuiDrawer
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
        <DrawerMenuItem
          url="/downloader"
          text_props={{
            primary: "Downloader"
          }}
          icon={<CloudDownload />}
        />

        <DrawerMenuItem
          url="/yaml"
          text_props={{
            primary: "Custom Submission"
          }}
          icon={<NotesIcon />}
        />

        <ListItem dense>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>

        <Divider />
      </List>

      <DrawerAccountMenuItemContainer />
    </MuiDrawer>
  );
};

export default Drawer;
