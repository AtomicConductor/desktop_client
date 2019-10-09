import React, { useState } from "react";

import { Typography, Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  LibraryBooksRounded,
  ContactSupportRounded,
  FeedbackRounded
} from "@material-ui/icons";
import config from "../../config";

import Feedback from "./Feedback";
import IndexCard from "./IndexCard";

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
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const browse = url => () => nw.Shell.openExternal(url);
  const { documentationUrl, supportUrl, dashboardUrl } = config;

  return (
    <Box className={classes.container}>
      <Typography variant="h4" className={classes.headerText}>
        Get Started!
      </Typography>

      <Typography
        variant="h6"
        className={classes.subheader}
        color="textSecondary"
      >
        Conductor tools are installed and you are ready to go. Use the links
        below to get specific info for your platform or to contact us for help.
      </Typography>

      <Grid container spacing={8}>
        <IndexCard
          onClick={browse(documentationUrl)}
          title="Documentation"
          body={
            <React.Fragment>
              Learn how to submit your renders from within <strong>Maya</strong>
              , <strong>Nuke</strong> and <strong>Clarisse</strong>, or get help
              crafting your submissions through simple Python APIs.
            </React.Fragment>
          }
          icon={<LibraryBooksRounded className={classes.avatar} />}
        />

        <IndexCard
          onClick={browse(supportUrl)}
          title="Support center"
          body="Have questions about the service or need some guidance? Submit
          a support ticket and you'll get a response from one of our
          developers within the hour."
          icon={<ContactSupportRounded className={classes.avatar} />}
        />

        <IndexCard
          onClick={browse(dashboardUrl)}
          title="Web Dashboard"
          body="Head over to our web application at conductortech.com to check
          the status of your running jobs and more."
          icon={<ContactSupportRounded className={classes.avatar} />}
        />

        <IndexCard
          onClick={() => {
            setFeedbackFormOpen(true);
          }}
          title="Beta Feedback"
          body="Thanks for trying out the Conductor desktop agent. If you find an
          issue or have a suggestion, please click here to let us know."
          icon={<FeedbackRounded className={classes.avatar} />}
        />

        <Feedback
          feebackFormOpen={feedbackFormOpen}
          onCloseFeedbackForm={() => setFeedbackFormOpen(false)}
        />
      </Grid>
    </Box>
  );
};
