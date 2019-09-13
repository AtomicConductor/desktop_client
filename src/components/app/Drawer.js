import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  Divider,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer
} from "@material-ui/core";
import {
  CloudDownload,
  Notes,
  Help
} from "@material-ui/icons";
import Account from "../account/AccountContainer";

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

const Drawer = props => {
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
        <Account  />

        <Divider />

        <ListItem component={RouterLink} to="/downloader" button>
          <ListItemIcon>
            <CloudDownload />
          </ListItemIcon>
          <ListItemText primary="Downloader">
          </ListItemText>
        </ListItem>

        <ListItem component={RouterLink} to="/yaml" button>
          <ListItemIcon>
            <Notes />
          </ListItemIcon>
          <ListItemText primary="Custom Submission">
          </ListItemText>
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Help />
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
