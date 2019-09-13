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
  logo: {
    fontFamily: "Raleway",
    fontSize: 24,
    textAlign: "center",
    fontWeight: 500,
    marginBottom: theme.spacing(1)
  },
  spacer: {
    display: "flex",
    flexGrow: "1",
    flexDirection: "column"
  },
  list: {
    paddingTop: 0
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

      <List className={classes.list}>
        <DrawerAccountMenuItemContainer />
        <Divider />
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

        <ListItem button>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>

        <Divider />
      </List>
      <div className={classes.spacer} />
      <Typography className={classes.logo}>CONDUCTOR</Typography>

    </MuiDrawer>
  );
};

export default Drawer;
