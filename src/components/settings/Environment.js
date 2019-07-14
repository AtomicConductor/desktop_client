import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Table from "./Table";

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

const Environment = props => {
  const classes = useStyles();

  const { settings, project, process, python } = props.environment;
  console.log(settings);

  return (
    <div className={classes.root}>
      <Table data={settings} title="Settings" />
      <Table data={project} title="Google project" />
      <Table data={process} title="Process" />
      <Table data={python} title="Python" />
    </div>
  );
};

Environment.propTypes = {
  environment: PropTypes.object.isRequired
};

export default Environment;
