import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
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

  const { settings, project } = props.environment;
  console.log(settings);

  const settingsArray = Object.keys(settings).map(k => ({
    name: k,
    value: settings[k]
  }));

  return (
    <div className={classes.root}>
      <CtSettingsTable data={settings} title="Settings" />
      <CtSettingsTable data={project} title="Google project" />
    </div>
  );
};

CtSettingsEnvironment.propTypes = {
  environment: PropTypes.object.isRequired
};

export default CtSettingsEnvironment;
