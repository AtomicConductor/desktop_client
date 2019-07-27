import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Table from "./Table";
import { appBarHeight } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: "80px",
    margin: "auto"
  },

  table: {
    minWidth: 650
  },
  container: {
    marginTop: appBarHeight,

    paddingLeft: 2,
    width: "100%",
    overflow: "auto"
  }
}));

const Environment = props => {
  const classes = useStyles();

  const { settings, project, process, python } = props.environment;
  // console.log(JSON.stringify(settings));

  return (
    <div className={classes.container}>
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
