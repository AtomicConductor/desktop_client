import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Typography, Card, Button, Box } from "@material-ui/core";
import Advanced from "./advanced/Advanced";
import Uploads from "./uploads/Uploads";
import General from "./general/General";
import Software from "./software/Software";

import Preview from "./preview/Preview";
import AppBar from "./AppBar";
import SignIn from "../account/SignIn";
import { appBarHeight } from "../../_helpers/constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import NoticeDialog from "./NoticeDialog";
import SubmissionShield from "./SubmissionShield";

import LoadSaveMenu from "./LoadSaveMenu";
import { submissionValidSelector } from "../../selectors/submitter";

import {
  submit,
  fetchProjects,
  fetchInstanceTypes,
  loadPythonLocation
} from "../../_actions/submitter";

import { loadPresets } from "../../_actions/entities";
import { signedInSelector } from "../../selectors/account";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: appBarHeight,
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  tabsCard: {
    display: "flex",
    flexDirection: "row",
    height: theme.spacing(4.5), // 36
    flexGrow: 0,
    flexShrink: 0
  },
  actionsCard: {
    height: theme.spacing(5),
    display: "flex",
    flexShrink: 0,
    alignItems: "center"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "auto"
  },

  tabsRoot: {
    height: theme.spacing(4.5),
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-start"
  },
  tab: {
    paddingTop: 0,
    paddingBottom: theme.spacing(0.5)
  },
  progressBox: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(3)
  },
  spacer: {
    flexGrow: "1"
  },
  filename: {
    paddingLeft: theme.spacing(1)
  }
}));

const Submitter = props => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);
  const signedIn = useSelector(state => signedInSelector(state));
  const submitting = useSelector(state => state.submitter.submitting);
  const filename = useSelector(state => state.submitter.filename);
  const { errors, alerts } = useSelector(submissionValidSelector);
  const [submissionShieldOpen, setSubmissionShieldOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!signedIn) return;
    dispatch(fetchProjects());
    dispatch(fetchInstanceTypes());
    dispatch(loadPythonLocation());
    dispatch(loadPresets());
  }, [signedIn, dispatch]);

  if (!signedIn) {
    return <SignIn />;
  }

  function handleChange(event, newTabIndex) {
    setTabIndex(newTabIndex);
  }

  function handleSubmit() {
    if (errors.length || alerts.length) {
      setSubmissionShieldOpen(true);
    } else {
      dispatch(submit());
    }
  }

  const labels = ["General", "Files", "Software", "Advanced", "Preview"];

  return (
    <React.Fragment>
      <AppBar />
      <Box className={classes.container}>
        <Card className={classes.tabsCard}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            classes={{
              flexContainer: classes.tabsRoot,
              root: classes.tabsRoot
            }}
            color="inherit"
          >
            {labels.map((_, i) => (
              <Tab
                key={i}
                label={_}
                classes={{ wrapper: classes.tab, root: classes.tab }}
              />
            ))}
          </Tabs>
        </Card>
        <Box className={classes.content}>
          {
            [<General />, <Uploads />, <Software />, <Advanced />, <Preview />][
              tabIndex
            ]
          }
        </Box>

        <Card className={classes.actionsCard}>
          <LoadSaveMenu />
          <Typography
            variant="body2"
            color="primary"
            className={classes.filename}
          >
            {filename || "This submission has not been saved"}
          </Typography>

          <div className={classes.spacer} />
          {submitting ? (
            <Box className={classes.progressBox}>
              <CircularProgress size={30} color="secondary" />
            </Box>
          ) : (
            <Button color="secondary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Card>
        <NoticeDialog />
        <SubmissionShield
          submissionShieldOpen={submissionShieldOpen}
          validationResult={{ errors, alerts }}
          handleSubmit={() => {
            setSubmissionShieldOpen(false);
            dispatch(submit());
          }}
          handleClose={() => setSubmissionShieldOpen(false)}
        />
      </Box>
    </React.Fragment>
  );
};

export default Submitter;
