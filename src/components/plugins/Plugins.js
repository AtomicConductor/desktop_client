import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import FilterDrawerContainer from "./FilterDrawerContainer";
import PluginItemContainer from "./PluginItemContainer";

import AppBarContainer from "./AppBarContainer";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

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
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: 2,
    marginTop: appBarHeight,
    width: `100%`,
    flexWrap: "wrap",
    alignContent: "flex-start",
    overflow: "auto"
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

const Plugins = props => {
  const { plugins } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBarContainer />

      <Box
        spacing={1}
        className={classes.container}
        // alignItems="flex-start"
      >
        {plugins.map((plugin, i) => (
          <PluginItemContainer key={i} plugin={plugin} />
        ))}
      </Box>
    </React.Fragment>
  );
};

Plugins.propTypes = {
  plugins: PropTypes.array.isRequired
};

export default Plugins;
