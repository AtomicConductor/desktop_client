import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PluginItem from "./PluginItem";
import AppBar from "./AppBar";
import { Box, Card, Typography } from "@material-ui/core";
import { appBarHeight } from "../../_helpers/constants";
import { useDispatch } from "react-redux";
import { pkgNamesArraySelector } from "../../_selectors/plugins";
import { packageLocation } from "../../_selectors/settings";

import { loadPackageLocation } from "../../_actions/settings/packageLocation";
import { loadPythonLocation } from "../../_actions/settings/pythonLocation";
import { pythonLocationValid } from "../../_selectors/settings";
import { helpOpenSelector } from "../../_selectors/plugins";

import PluginHelpPanel from "./PluginHelpPanel";
import { useSelector } from "react-redux";
import PythonAlert from "../../components/settings/PythonAlert";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: appBarHeight,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between"
  },
  container: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: 2,
    width: `100%`,
    flexWrap: "wrap",
    alignContent: "flex-start",
    overflow: "auto"
  },
  actionsCard: {
    height: theme.spacing(5),
    display: "flex",
    flexShrink: 0,
    alignItems: "center"
  },
  locationText: {
    display: "block",
    paddingLeft: theme.spacing(1),
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}));

const Plugins = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPackageLocation());
    dispatch(loadPythonLocation());
  }, [dispatch]);

  const pluginNames = useSelector(state => pkgNamesArraySelector(state));
  const installLocation = useSelector(state => packageLocation(state));
  const pythonValid = useSelector(pythonLocationValid);
  const helpPlugin = useSelector(state => helpOpenSelector(state));
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar />

      <Box spacing={1} className={classes.root}>
        <Box spacing={1} className={classes.container}>
          {pluginNames.map((pluginName, i) => (
            <PluginItem key={i} pluginName={pluginName} />
          ))}
        </Box>
        {pythonValid ? (
          <Card className={classes.actionsCard}>
            <Typography
              color={"primary"}
              className={classes.locationText}
              variant="body2"
            >
              {`Conductor location: ${installLocation ||
                "EMPTY - Please set the Conductor location in the Settings page"}`}
            </Typography>
          </Card>
        ) : (
          <PythonAlert
            message="In order to install plugins you'll need to select a supported Python version on the settings page."
            button
          />
        )}

        <PluginHelpPanel pluginName={helpPlugin} />
      </Box>
    </React.Fragment>
  );
};

export default Plugins;
