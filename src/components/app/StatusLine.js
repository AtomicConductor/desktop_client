import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper, Typography, IconButton } from "@material-ui/core";
import { Notes } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { lastEventsSelector } from "../../selectors/log";
import "typeface-raleway";
import { drawerWidth, statusLineHeight } from "../../_helpers/constants";
import { paths } from "../../_helpers/constants";
import { useHistory, useLocation } from "react-router-dom";

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
    zIndex: 1301
  },
  statusText: {
    display: "block",
    paddingLeft: theme.spacing(1),
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  icon: {
    margin: 0,
    padding: 0,
    borderRadius: 0
  },
  error: {
    color: "red"
  }
}));

const StatusLine = () => {
  const { log } = paths;
  const classes = useStyles();
  const { time, level, text } = useSelector(lastEventsSelector);

  const status = `${moment(time).format("MMM Do, HH:mm:ss")}: ${text}`;
  let history = useHistory();

  const onLog = useLocation().pathname === log;
  function handleClick() {
    if (onLog) {
      history.goBack();
    } else {
      history.push(log);
    }
  }

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <IconButton
          onClick={handleClick}
          color={onLog ? "secondary" : "primary"}
          className={classes.icon}
        >
          <Notes fontSize="small" />
        </IconButton>
        <Typography
          color={level === "error" ? "error" : "primary"}
          className={classes.statusText}
          variant="body2"
        >
          {status}
        </Typography>
      </Paper>
    </Box>
  );
};

export default StatusLine;
