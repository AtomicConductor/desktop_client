import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  container: {}
}));

const General = props => {
  const classes = useStyles();

  return <Box className={classes.container} />;
};

export default General;
