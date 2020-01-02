import React from "react";

import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocalStorage } from "../../hooks/localStorage";
import { settings } from "../../_helpers/constants";
import { useEffect } from "react";

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(8, 12),
    flexGrow: 1
  },
  headerText: {
    fontWeight: "bold",
    marginBottom: theme.spacing(4)
  },
  subheader: {
    marginBottom: theme.spacing(4)
  }
}));

export default () => {
  const classes = useStyles();
  const [, setShowWelcomePage] = useLocalStorage(settings.showWelcomePage);

  useEffect(() => {
    return () => setShowWelcomePage(false);
  }, [setShowWelcomePage]);

  return (
    <Box className={classes.container}>
      <Typography variant="h4" className={classes.headerText}>
        Welcome!
      </Typography>

      <Typography
        variant="h6"
        className={classes.subheader}
        color="textSecondary"
      >
        Your mission, should you choose to accept it, is to give me cookies!
      </Typography>
    </Box>
  );
};
