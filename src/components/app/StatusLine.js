import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import "typeface-raleway";
import { drawerWidth, statusLineHeight } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    display: "flex",
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    height: statusLineHeight
  },
  paper: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["800"],
    borderColor: theme.palette.grey["700"],
    borderStyle: "solid",
    borderWidth: 1,
    zIndex: 1301
  },
  statusText: {
    paddingLeft: theme.spacing(1),
    color: theme.palette.text.hint
  }
}));

const StatusLine = props => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <Typography className={classes.statusText} variant="body2">
          Status
        </Typography>
      </Paper>
    </Box>
  );
};

export default StatusLine;
