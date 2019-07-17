import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import FilterDrawerContainer from "./FilterDrawerContainer";
import PluginItemContainer from "./PluginItemContainer";

import AppBarContainer from "./AppBarContainer";

import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  appBarHeight,
  filterDrawerWidth,
  statusLineHeight,
  drawerWidth
} from "../../_helpers/constants";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: 2,
    marginTop: appBarHeight,
    width: `calc(100% - ${drawerWidth}px)`,
    overflow: "auto",
    position: "absolute",
    height: `calc(100% - ${appBarHeight + statusLineHeight}px)`
  },

  centeredBox: {
    // border: "1px solid red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },

  progress: {
    margin: "auto"
  }
}));

const plugins = [
  {
    title: "Maya Submitter",
    name: "maya",
    description:
      "Installs the Conductor submitter UI for Maya as a module. Once installed, access the UI from the Conductor menu"
  },
  {
    title: "Nuke Submitter",
    name: "nuke",
    description:
      "Installs the Conductor submitter UI for Nuke. Once installed, access the UI from the Plugins menu."
  },
  {
    title: "Clarisse Submitter",
    name: "clarisse",
    description:
      "Installs the Conductor scripted class for Clarisse. Once installed, access the UI from the Create Item menu."
  },
  {
    title: "Silhouette Submitter",
    name: "silhouette",
    description:
      "Installs the Conductor Silhouette. Once installed, access the UI from the Create menu."
  }
];

const Plugins = props => {
  // const { jobs, loading, fetchPlugins } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("panel1");

  const onPanelClick = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : "");
  };

  // Similar to componentDidMount and componentDidUpdate:

  // useEffect(() => {
  //   setExpanded("00921");
  // }, []);

  // useEffect(() => {
  //   fetchPlugins();
  // }, []);

  return (
    <React.Fragment>
      <AppBarContainer />

      <Box className={classes.container}>
        {plugins.map((plugin, i) => (
          <PluginItemContainer
            key={plugin.name}
            plugin={plugin}
            expanded={expanded}
            onPanelClick={onPanelClick}
          />
        ))}
      </Box>
    </React.Fragment>
  );
};

Plugins.propTypes = {
  // jobs: PropTypes.array.isRequired,
  // loading: PropTypes.bool.isRequired,
  // fetchPlugins: PropTypes.func.isRequired
};

export default Plugins;
