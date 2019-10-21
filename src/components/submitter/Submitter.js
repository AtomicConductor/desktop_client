/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import UploadsControls from "./uploads/UploadsControls";
import EnvironmentControls from "./EnvironmentControls";

import Environment from "./Environment";
import Uploads from "./uploads/Uploads";
import General from "./general/General";
import Software from "./software/Software";
import Preview from "./preview/Preview";

import AppBar from "./AppBar";
import SignIn from "../account/SignIn";
import { appBarHeight } from "../../_helpers/constants";

import { testPythonShell } from "../../_actions/submitter";

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
  },
  secondaryControl: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center"
  }
}));

const Submitter = props => {
  const { fetchResources, loggedIn } = props;

  if (!loggedIn) {
    return <SignIn />;
  }

  const classes = useStyles();

  const [tabIndex, setTabIndex] = React.useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchResources();
  }, []);

  const renderSecondaryControl = () => {
    switch (tabIndex) {
      case 1:
        return <UploadsControls />;
      case 2:
        return <EnvironmentControls />;

      default:
        return null;
    }
  };

  function handleChange(event, newTabIndex) {
    setTabIndex(newTabIndex);
  }

  function handleSubmit(event) {
    dispatch(testPythonShell());
    console.log("testPythonShell");
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
              label="Extra uploads"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Environment"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Software"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Preview"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
          </Tabs>

          <Box className={classes.secondaryControl}>
            {renderSecondaryControl()}
          </Box>
        </Card>
        <Box className={classes.content} id="scroll-box">
          {tabIndex === 0 && <General />}
          {tabIndex === 1 && <Uploads />}
          {tabIndex === 2 && <Environment />}
          {tabIndex === 3 && <Software />}
          {tabIndex === 4 && <Preview />}
        </Box>
        <Card className={classes.actionsCard}>
          <Button color="primary">Save</Button>
          <Button color="primary">Load</Button>
          <Button color="secondary" onClick={handleSubmit}>
            Submit
          </Button>
        </Card>
      </Box>
    </React.Fragment>
  );
};

Submitter.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  fetchResources: PropTypes.func.isRequired
};

export default Submitter;
