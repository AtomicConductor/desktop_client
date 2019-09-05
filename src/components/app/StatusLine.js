import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Paper,
  Typography
} from "@material-ui/core";
import "typeface-raleway";
import {
  drawerWidth,
  statusLineHeight,
  appVersion
} from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    display: "flex",
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    height: statusLineHeight,
    bottom: 0
  },
  paper: {
    flexGrow: 1,
    display: "flex",
    backgroundColor: theme.palette.grey["800"],
    borderColor: theme.palette.grey["700"],
    borderStyle: "solid",
    borderWidth: 1,
    zIndex: 1301,
    justifyContent: "flex-end"
  },
  statusText: {
    padding: theme.spacing(0, 1),
    color: theme.palette.text.hint
  }
}));

const StatusLine = props => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <Typography className={classes.statusText} variant="body2">
          Version: {appVersion}
        </Typography>
      </Paper>
    </Box>
  );
};

export default StatusLine;
