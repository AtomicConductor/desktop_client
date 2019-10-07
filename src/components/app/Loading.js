import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  box: {},
  margin: theme.spacing(2)
}));

const Loading = props => {
  const classes = useStyles();

  return (
    <div className={props.classes.root}>
      <CircularProgress className={classes.progress} color="secondary" />
    </div>
  );
};

export default Loading;
