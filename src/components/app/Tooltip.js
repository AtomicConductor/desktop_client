import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Tooltip as MuiTooltip } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";

const useStyles = makeStyles(theme => ({
  iconButton: {
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1)
  },
  customWidth: {
    maxWidth: 800
  }
}));

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: grey[500],
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 13
  }
}))(MuiTooltip);

const Tooltip = props => {
  const { title, children } = props;
  const classes = useStyles();

  return (
    <StyledTooltip
      enterDelay={300}
      title={title}
      placement="top"
      classes={{ tooltip: classes.customWidth }}
    >
      {children}
    </StyledTooltip>
  );
};

export default Tooltip;
