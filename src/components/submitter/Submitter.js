import React, { useEffect } from "react";
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

import {
  submit,
  fetchProjects,
  fetchInstanceTypes
} from "../../_actions/submitter";
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
    justifyContent: "flex-end",
    flexShrink: 0
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
  }
}));

const Submitter = props => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);
  const signedIn = useSelector(state => signedInSelector(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!signedIn) return;
    dispatch(fetchProjects());
    dispatch(fetchInstanceTypes());
  }, [signedIn, dispatch]);

  if (!signedIn) {
    return <SignIn />;
  }

  function handleChange(event, newTabIndex) {
    setTabIndex(newTabIndex);
  }

  function handleSubmit(event) {
    dispatch(submit());
  }

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
            <Tab
              label="General"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Files"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Software"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Advanced"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Preview"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
          </Tabs>
        </Card>
        <Box className={classes.content}>
          {tabIndex === 0 && <General />}
          {tabIndex === 1 && <Uploads />}
          {tabIndex === 2 && <Software />}
          {tabIndex === 3 && <Advanced />}
          {tabIndex === 4 && <Preview />}
        </Box>
        <Card className={classes.actionsCard}>
          <Button color="secondary" onClick={handleSubmit}>
            Submit
          </Button>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default Submitter;