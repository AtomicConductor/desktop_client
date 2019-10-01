import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Link
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  formTitle: {
    color: theme.palette.secondary.main
  }
}));

export default props => {
  const classes = useStyles();

  const handleFormClose = () => {
    props.oncCloseFeedbackForm();
  };

  return (
    <Dialog open={props.feebackFormOpen} onClose={props.oncCloseFeedbackForm}>
      <DialogTitle id="form-dialog-title" className={classes.formTitle}>Send us a message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Use the form below or email us at <Link>{' support@conductortech.com '}</Link>
        </DialogContentText>
        <TextField
          margin="normal"
          id="email"
          label="Email"
          type="email"
          fullWidth
          required
          variant="outlined"
        />

        <TextField
          margin="normal"
          id="subject"
          label="Subject"
          type="text"
          fullWidth
          required
          variant="outlined"
        />

        <TextField
          margin="normal"
          id="message"
          label="How can we help?"
          type="text"
          fullWidth
          multiline
          rows="6"
          required
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFormClose} color="secondary">
          Cancel
        </Button>
        <Button color="secondary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
};