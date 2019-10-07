import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import PluginItemContainer from "./PluginItemContainer";
import AppBar from "./AppBar";
import Box from "@material-ui/core/Box";
import { appBarHeight } from "../../_helpers/constants";

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
  }
}));

const Plugins = props => {
  const { plugins } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar />
      <Box spacing={1} className={classes.container}>
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
