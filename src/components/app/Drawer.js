import React from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { signedInSelector } from "../../_selectors/account";
import {
  List,
  Typography,
  ListItemText,
  ListItem,
  ListItemIcon,
  Drawer as MuiDrawer,
  Divider
} from "@material-ui/core";

import {
  CloudDownloadRounded,
  BuildRounded,
  SettingsApplicationsRounded,
  LibraryBooksRounded,
  LockRounded,
  Power
} from "@material-ui/icons";

import { appVersion } from "../../_helpers/constants";

import Account from "../account/Account";

import "typeface-raleway";
import { drawerWidth, paths } from "../../_helpers/constants";
import { useSelector } from "react-redux";

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
    fontWeight: 700
  },
  spacer: {
    display: "flex",
    flexGrow: "1",
    flexDirection: "column"
  },
  list: {
    paddingTop: 0
  },
  versionText: {
    textAlign: "center",
    padding: theme.spacing(0, 1),
    color: theme.palette.text.hint
  }
}));

const Drawer = props => {
  const classes = useStyles();
  const isSignedIn = useSelector(state => signedInSelector(state));
  const { resources, downloader, submitter, plugins, settings, signIn } = paths;
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
        {isSignedIn ? (
          <Account />
        ) : (
          <ListItem
            component={RouterLink}
            to={signIn}
            button
            selected={pathname === signIn}
          >
            <ListItemIcon>
              <LockRounded />
            </ListItemIcon>
            <ListItemText primary="Sign in" />
          </ListItem>
        )}
        <Divider />
        <ListItem
          component={RouterLink}
          to={plugins}
          button
          selected={pathname === plugins}
        >
          <ListItemIcon>
            <Power />
          </ListItemIcon>
          <ListItemText primary="Plugins" />
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
            <BuildRounded />
          </ListItemIcon>
          <ListItemText primary="Submission Kit" />
        </ListItem>

        <ListItem
          component={RouterLink}
          to={resources}
          button
          selected={pathname === resources}
        >
          <ListItemIcon>
            <LibraryBooksRounded />
          </ListItemIcon>
          <ListItemText primary="Help & Feedback" />
        </ListItem>

        <ListItem
          component={RouterLink}
          to={settings}
          button
          selected={pathname === settings}
        >
          <ListItemIcon>
            <SettingsApplicationsRounded />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <div className={classes.spacer} />
      <Typography className={classes.logo}>CONDUCTOR</Typography>
      <Typography className={classes.versionText} variant="body2">
        Version: {appVersion}
      </Typography>
    </MuiDrawer>
  );
};

export default withRouter(Drawer);
