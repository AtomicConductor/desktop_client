import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  Typography,
  Drawer as MuiDrawer
} from "@material-ui/core";
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
      </List>
      <div className={classes.spacer} />
      <Typography className={classes.logo}>CONDUCTOR</Typography>

    </MuiDrawer>
  );
};

export default Drawer;
