import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MUISnackbar from "@material-ui/core/Snackbar";
import MUISnackbarContent from "@material-ui/core/SnackbarContent";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";

import { snackbarSelector } from "../../selectors/snackbar";

import { useSelector, useDispatch } from "react-redux";

import { clearNotification } from "../../_actions/notification";

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
    color: theme.palette.text.primary
  },
  success: {
    backgroundColor: green[800]
  },
  error: {
    backgroundColor: red[900]
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[900]
  },

  iconVariant: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.text.primary
  }
}));

const Snackbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { message, show, type, url, buttonLabel } = useSelector(
    snackbarSelector
  );

  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
  };

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearNotification());
  }

  function handleButtonClick(event) {
    nw.Shell.openExternal(url);
  }

  const Icon = variantIcon[type];

  const actions = [];
  if (url !== "") {
    actions.push(
      <Button
        key="details"
        color="inherit"
        size="small"
        onClick={handleButtonClick}
      >
        {buttonLabel}
      </Button>
    );
  }
  actions.push(
    <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      className={classes.close}
      onClick={handleClose}
    >
      <CloseIcon />
    </IconButton>
  );

  return (
    <MUISnackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      open={show}
      autoHideDuration={6000}
      onClose={handleClose}
      message={<span id="message-id">{message}</span>}
    >
      <MUISnackbarContent
        className={classes[type]}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classes.iconVariant} />
            {message}
          </span>
        }
        action={actions}
      />
    </MUISnackbar>
  );
};

export default Snackbar;
