import React, { useCallback, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import submitFeedback from '../../_actions/feedback';

const useStyles = makeStyles(theme => ({
  formTitle: {
    color: theme.palette.secondary.main
  }
}));

export default props => {
  const classes = useStyles();
  const { onCloseFeedbackForm, feebackFormOpen } = props;
  const email = useSelector(state => state.profile.credentials.email);
  const [feedback, setFeedback] = useState({ email });
  const dispatch = useDispatch();
  const submitForm = useCallback(() => dispatch(submitFeedback(feedback)), [dispatch, feedback]);

  const handleFormClose = () => {
    setFeedback({});
    onCloseFeedbackForm();
  };

  const handleInputChange = e => {
    const { value, id } = e.target;
    setFeedback({ ...feedback, [id]: value });
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    submitForm();
    handleFormClose();
  }

  return (
    <Dialog open={feebackFormOpen} onClose={onCloseFeedbackForm}>
      <DialogTitle id="form-dialog-title" className={classes.formTitle}>Send us a message</DialogTitle>
      <form autoComplete="off" onSubmit={handleFormSubmit}>
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
            onChange={handleInputChange}
            value={email}
          />

          <TextField
            margin="normal"
            id="subject"
            label="Subject"
            type="text"
            fullWidth
            required
            variant="outlined"
            onChange={handleInputChange}
            inputProps={{ minLength: 3, maxLength: 200 }}
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
            onChange={handleInputChange}
            inputProps={{ minLength: 10, maxLength: 1000 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="secondary">
            Cancel
          </Button>
          <Button color="secondary" type="submit">
            Send
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
};