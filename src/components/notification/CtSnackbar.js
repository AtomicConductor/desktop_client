import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
    color: theme.palette.text.primary
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
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

const CtSnackbar = props => {
  const classes = useStyles();

  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
  };

  const { dismiss, showDetail, content, open, hasDetails, type } = props;

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    dismiss();
  }

  function handleShowDetails(event) {
    showDetail();
  }

  const Icon = variantIcon[type];

  const actions = [];
  if (hasDetails) {
    actions.push(
      <Button
        key="details"
        color="secondary"
        size="small"
        onClick={handleShowDetails}
      >
        DETAILS
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
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={<span id="message-id">{content}</span>}
    >
      <SnackbarContent
        className={classes[type]}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classes.iconVariant} />
            {content}
          </span>
        }
        action={actions}
      />
    </Snackbar>
  );
};

CtSnackbar.propTypes = {
  content: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  hasDetails: PropTypes.bool.isRequired,
  dismiss: PropTypes.func.isRequired,
  showDetail: PropTypes.func.isRequired
};

export default CtSnackbar;
