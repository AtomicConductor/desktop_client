import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const OutputPathField = props => {
  const classes = useStyles();

  // const { disabled, value, setValue } = props;

  const handleSelectDirectory = event => {
    if (event.target.files && event.target.files[0]) {
      // setValue(event.target.files[0].path);
    }
  };
  const handleEdit = event => {
    // setValue(event.target.value);
  };

  return (
    <ListItem dense>
      <TextField
        fullWidth
        // dense
        id="standard-with-placeholder"
        label="Output path"
        placeholder="Override the output path (optional)"
        value={"/some/project/output/path"}
        onChange={handleEdit}
        variant="outlined"
      />

      <input
        hidden
        className={classes.input}
        id="icon-button-file"
        type="file"
        nwdirectory="true"
        onChange={handleSelectDirectory}
      />

      <label htmlFor="icon-button-file">
        <IconButton
          // disabled={disabled}
          color="primary"
          className={classes.button}
          aria-label="Upload picture"
          component="span"
        >
          <FolderIcon />
        </IconButton>
      </label>
    </ListItem>
  );
};

OutputPathField.propTypes = {
  // value: PropTypes.string.isRequired,
  // setValue: PropTypes.func.isRequired,
  // disabled: PropTypes.bool.isRequired
};

export default OutputPathField;
