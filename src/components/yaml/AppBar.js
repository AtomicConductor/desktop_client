import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { drawerWidth } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
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
          Yaml
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
