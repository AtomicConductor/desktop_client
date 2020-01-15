import React from "react";

import { Typography, Box, Grid, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocalStorage } from "../../hooks/localStorage";
import { settings } from "../../_helpers/constants";
import { useEffect } from "react";
import IndexCard from "../resources/IndexCard";
import { PlayCircleFilledWhiteRounded } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";
import config from "../../config";

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
        Welcome
      </Typography>

      <Typography className={classes.subheader} color="textSecondary">
        Thank you for downloading <strong>Conductor Companion</strong>! Through
        this app, you can submit your jobs and download rendered files directly
        to your workstation or laptop more conveniently than ever before.
      </Typography>

      <Typography className={classes.subheader} color="textSecondary">
        Once signed in, the <strong>Downloader</strong> tab will automatically
        populate with a log of your account's downloadable files.
      </Typography>

      <Typography className={classes.subheader} color="textSecondary">
        Submissions can now be easily managed in the{" "}
        <strong>Submission Kit</strong>, which contains a series of tabs that
        allow you to manage the details and settings for jobs in a simple GUI.
        While Conductor integrates directly into the Maya, Nuke and Clarisse
        applications, Companion enables submission from all other supported
        software without the need to write a command line.
      </Typography>

      <Grid container spacing={8}>
        <IndexCard
          lg={12}
          sm={12}
          onClick={() => {
            nw.Shell.openExternal(config.documentationUrl);
          }}
          title="Getting Started"
          body={
            <React.Fragment>
              We have built a series of tutorials, and located them alongside
              user guides and more in the documentation of this app. To get the
              most out of Conductor Companion, and familiarize yourself with all
              of its functions, <Link>visit the documentation.</Link>
            </React.Fragment>
          }
          icon={<PlayCircleFilledWhiteRounded className={classes.avatar} />}
        />
        <Grid item lg={12} sm={12}>
          <Alert variant="outlined" severity="info">
            <AlertTitle>Note</AlertTitle>
            <Typography>
              This one-time welcome page will not be accessible upon navigating
              to another page, but you can always access helpful resources and
              links in the <strong>{"Help & Feedback"}</strong> tab in the
              navigation menu on the left.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
