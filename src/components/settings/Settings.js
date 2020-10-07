import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Typography, Card, Box } from "@material-ui/core";
import Python from "./python/Python";

import AppBar from "./AppBar";

import { appBarHeight } from "../../_helpers/constants";
import { pythonLocationValid } from "../../_selectors/settings";
import { loadPythonLocation } from "../../_actions/settings/pythonLocation";
import { loadPackageLocation } from "../../_actions/settings/packageLocation";
import PythonAlert from "./PythonAlert";
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

const labels = ["Python"];

const Settings = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const dispatch = useDispatch();
  const pythonValid = useSelector(pythonLocationValid);

  useEffect(() => {
    dispatch(loadPythonLocation());
    dispatch(loadPackageLocation());
  }, [dispatch]);

  const handleChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return (
    <React.Fragment>
      <AppBar />
      <Box className={classes.container}>
        {pythonValid ? null : (
          <PythonAlert
            message={`If you wish to install plugins or use the Submission Kit you'll need Python from the 2.7 branch. 
We recommend getting the latest release version of Python 2.7. Our support team may ask you to upgrade your Python version should you require technical support.`}
            overlay="bottom"
          />
        )}
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
        <Box className={classes.content}>{[<Python />][tabIndex]}</Box>
      </Box>
    </React.Fragment>
  );
};

export default Settings;
