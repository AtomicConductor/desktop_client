import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import clsx from "clsx";
const useStyles = makeStyles(theme => ({
  label: {
    paddingTop: 5,
    flexShrink: 0,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2)
  },

  firstLabel: {
    width: theme.spacing(20)
  }
}));

const InputLabel = props => {
  const classes = useStyles();

  const { firstLabel, label } = props;

  return (
    <Typography
      color="primary"
      align="right"
      display="block"
      className={clsx({
        [classes.label]: true,
        [classes.firstLabel]: firstLabel
      })}
    >
      {label === "" ? label : `${label}: `}
    </Typography>
  );
};

InputLabel.propTypes = {
  label: PropTypes.string.isRequired,
  firstLabel: PropTypes.bool
};
InputLabel.defaultProps = {
  firstLabel: false
};

export default InputLabel;
