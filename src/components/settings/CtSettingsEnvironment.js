import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import CtSettingsTable from "./CtSettingsTable";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: "80px",
    margin: "auto"
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 650
  }
}));

const CtSettingsEnvironment = props => {
  const classes = useStyles();

  const { settings, project, process, python } = props.environment;
  console.log(settings);

  return (
    <div className={classes.root}>
      <CtSettingsTable data={settings} title="Settings" />
      <CtSettingsTable data={project} title="Google project" />
      <CtSettingsTable data={process} title="Process" />
      <CtSettingsTable data={python} title="Python" />
    </div>
  );
};

CtSettingsEnvironment.propTypes = {
  environment: PropTypes.object.isRequired
};

export default CtSettingsEnvironment;
