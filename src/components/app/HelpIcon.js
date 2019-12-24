import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/icons/HelpOutline";
import { IconButton } from "@material-ui/core";
import Tooltip from "./Tooltip";

const useStyles = makeStyles(theme => ({
  iconButton: {
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1)
  }
}));

const HelpIcon = props => {
  const { tooltip } = props;
  const classes = useStyles();
  return (
    <Tooltip title={tooltip}>
      <IconButton className={classes.iconButton} color="primary">
        <Icon className={classes.icon} />
      </IconButton>
    </Tooltip>
  );
};

export default HelpIcon;
