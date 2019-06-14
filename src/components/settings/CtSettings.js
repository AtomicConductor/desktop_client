import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import CtSettingsEnvironmentContainer from "./CtSettingsEnvironmentContainer";

import CtSettingsEditContainer from "./CtSettingsEditContainer";
import { drawerWidth } from "../../_helpers/constants";

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
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabsContainer: {
    height: 30,
    width: 600,
    marginTop: 200
  },
  title: {
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
    // ,zIndex: 1301
  },
  paper: {
    margin: "auto"
    // height: 30
  },
  tabBox: {
    // borderStyle: "solid",
    height: 30,
    width: `calc(100% - ${drawerWidth}px)`,
    display: "flex",
    justifyContent: "center",
    position: "fixed",
    marginLeft: drawerWidth,
    marginTop: 16
  }
  // tabbar: {
  //   marginTop: "62px"
  // },
}));

const CtSettings = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <React.Fragment>
      <Box className={classes.tabBox}>
        <Paper className={classes.paper}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Edit Settings" />
            <Tab label="Environment" />
          </Tabs>
        </Paper>
      </Box>
      {value === 0 && <CtSettingsEditContainer />}
      {value === 1 && <CtSettingsEnvironmentContainer />}
    </React.Fragment>
  );
};

export default CtSettings;
