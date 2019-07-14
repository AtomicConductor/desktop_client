import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";

import EnvironmentContainer from "./EnvironmentContainer";

import EditContainer from "./EditContainer";
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
  },
  // paper: {
  //   margin: "auto"
  // },
  tabBox: {
    // height: 30,
    // width: `calc(100% - ${drawerWidth}px)`,
    display: "flex",
    justifyContent: "center"
    // position: "fixed",
    // marginLeft: drawerWidth,
    // marginTop: 16
  }
}));

const Settings = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <React.Fragment>
      <AppBar position="static" variant="dense">
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            Settings
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            className={classes.tabBox}
            color="inherit"
          >
            <Tab label="Edit Settings" color="inherit" />
            <Tab label="Environment" />
          </Tabs>
        </Toolbar>
      </AppBar>
      {value === 0 && <EditContainer />}
      {value === 1 && <EnvironmentContainer />}
    </React.Fragment>
  );
};

export default Settings;
