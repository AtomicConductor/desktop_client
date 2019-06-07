import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import k from "../../helpers/constants";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },

  title: {
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${k.drawerWidth}px)`,
    marginLeft: k.drawerWidth,
    zIndex: 1301
  }
}));

const CtAccountAppBar = props => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Account
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CtAccountAppBar;
