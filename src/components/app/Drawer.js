import React from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  Typography,
  ListItemText,
  ListItem,
  ListItemIcon,
  Drawer as MuiDrawer
} from "@material-ui/core";

import {
  CloudDownloadRounded,
  HomeRounded,
  SettingsInputComponent
} from "@material-ui/icons";

import Account from "../account/Account";

import "typeface-raleway";
import { drawerWidth, paths } from "../../_helpers/constants";

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

const Drawer = props => {
  const classes = useStyles();
  const { home, downloader, submitter } = paths;
  const {
    location: { pathname }
  } = props;

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
        <Account />

        <ListItem
          component={RouterLink}
          to={home}
          button
          selected={pathname === home}
        >
          <ListItemIcon>
            <HomeRounded />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          component={RouterLink}
          to={downloader}
          button
          selected={pathname === downloader}
        >
          <ListItemIcon>
            <CloudDownloadRounded />
          </ListItemIcon>
          <ListItemText primary="Downloader" />
        </ListItem>

        <ListItem
          component={RouterLink}
          to={submitter}
          button
          selected={pathname === submitter}
        >
          <ListItemIcon>
            <SettingsInputComponent />
          </ListItemIcon>
          <ListItemText primary="Submission toolkit" />
        </ListItem>
      </List>
      <div className={classes.spacer} />
      <Typography className={classes.logo}>CONDUCTOR</Typography>
    </MuiDrawer>
  );
};

export default withRouter(Drawer);
