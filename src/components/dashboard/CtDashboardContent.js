import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },

  toolbar: { height: 48 },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  spacing: {
    marginBottom: "0.2em"
  }
}));

function CtDashboardContent() {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Typography variant="h4" className={classes.spacing}>
        Dashboard
      </Typography>

      <Typography variant="h6">Short term</Typography>
      <Typography paragraph>
        Only the downloader page will be visible and accessible.
      </Typography>
      <Typography paragraph>
        If user not authenticated when the app is started, it will open a web
        browser and use the web login flow.
      </Typography>

      <Typography variant="h6">Long term</Typography>
      <Typography paragraph>
        If not authenticated, you will see only a big login form in the middle
        of the page. No sidebar, nothing.
      </Typography>

      <Typography paragraph>
        Downloader form will be more like a filebrowser (possibly with
        thumbnails).
      </Typography>

      <Typography paragraph>Other sections will be visible.</Typography>
      <ul>
        <li>Uploader: Similar to downloader.</li>
        <li>Plugins: Install only the submitters you want, where you want.</li>
        <li>
          Dashboard: Eventually show jobs progress and so on - all the functions
          of web UI.
        </li>
      </ul>
    </main>
  );
}

export default CtDashboardContent;
