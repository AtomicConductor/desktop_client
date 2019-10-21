import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "row"
  },
  single: {
    height: 36
  }
}));

const InputRow = props => {
  const classes = useStyles();
  const { children, single } = props;

  return (
    <Box
      className={clsx({
        [classes.root]: true,
        [classes.single]: single
      })}
    >
      {children}
    </Box>
  );
};

InputRow.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default InputRow;
