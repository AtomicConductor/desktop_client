import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Toolbar, Typography } from "@material-ui/core";
import MuiAppBar from "@material-ui/core/AppBar";
import { drawerWidth } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  }
}));

const AppBar = props => {
  const classes = useStyles();
  return (
    <MuiAppBar position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          Log viewer
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
