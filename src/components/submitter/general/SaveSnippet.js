import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  formTitle: {
    color: theme.palette.secondary.main
  }
}));

export default props => {
  const classes = useStyles();
  const { onClose, open, onSave } = props;
  const [snippteName, setSnippetName] = useState("");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title" className={classes.formTitle}>
        Save Bookmark
      </DialogTitle>
      <form
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          onSave(snippteName);
          onClose();
        }}
      >
        <DialogContent>
          <DialogContentText>
            Enter a name to bookmark this task template.
          </DialogContentText>

          <TextField
            margin="normal"
            id="name"
            label="Bookmark name"
            type="text"
            fullWidth
            required
            variant="outlined"
            onChange={e => setSnippetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button color="secondary" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
