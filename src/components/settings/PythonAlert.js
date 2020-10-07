import React from "react";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import orange from "@material-ui/core/colors/deepOrange";
import grey from "@material-ui/core/colors/grey";

import WarningIcon from "@material-ui/icons/ReportProblemOutlined";

import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { paths } from "../../_helpers/constants";
const useStyles = makeStyles(theme => ({
  alert: {
    backgroundColor: grey[900],
    color: orange[500],
    width: "100%"
  },
  warningIcon: {
    color: orange[500]
  },

  overlayTop: {
    position: "absolute",
    top: 0,
    zIndex: 1200
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    zIndex: 1200
  },
  warningMessage: {
    color: "white"
  }
}));

const PythonAlert = props => {
  const classes = useStyles();

  const { message, overlay, button } = props;

  let history = useHistory();

  function handleClick() {
    history.push(paths[button]);
  }

  return (
    <Alert
      action={
        button ? (
          <Button color="secondary" size="small" onClick={handleClick}>
            {button}
          </Button>
        ) : null
      }
      icon={<WarningIcon fontSize="inherit" className={classes.warningIcon} />}
      className={clsx({
        [classes.alert]: true,
        [classes.overlayTop]: overlay === "top",
        [classes.overlayBottom]: overlay === "bottom"
      })}
    >
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
};

export default PythonAlert;

PythonAlert.propTypes = {
  overlay: PropTypes.oneOf(["top", "bottom", "off"]),
  button: PropTypes.oneOf(["settings", "plugins"])
};
PythonAlert.defaultProps = {
  overlay: "off",
  button: false
};
