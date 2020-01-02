import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";

import { makeStyles } from "@material-ui/core/styles";

import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    color: theme.palette.secondary.main,
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  actionRow: {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  error: {
    color: red[600]
  },
  warning: {
    color: amber[600]
  }
}));

export default props => {
  const classes = useStyles();
  const {
    submissionShieldOpen,
    handleSubmit,
    handleClose,
    validationResult: { errors, alerts }
  } = props;

  const hasErrors = errors.length;

  const messages = hasErrors ? errors : alerts;

  const title = hasErrors ? "Submission is invalid!" : "Are you sure?";
  const instruction = hasErrors
    ? "Please fix the issues listed below and try to resubmit."
    : "There are potential problems with your submission. Please review the alerts listed below. Press SUBMIT to continue.";

  const icon = hasErrors ? (
    <ErrorIcon className={classes.error} />
  ) : (
    <WarningIcon className={classes.warning} />
  );

  return (
    <Dialog open={submissionShieldOpen} onClose={handleClose}>
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{instruction}</DialogContentText>
      </DialogContent>
      <List>
        {messages.map((message, i) => (
          <ListItem dense key={i}>
            <ListItemIcon>{icon}</ListItemIcon>

            <ListItemText primary={message} />
          </ListItem>
        ))}
      </List>

      <DialogActions className={classes.actionRow}>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
        {!hasErrors && (
          <Button onClick={handleSubmit} color="secondary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
