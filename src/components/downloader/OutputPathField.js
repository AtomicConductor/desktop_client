import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import Box from "@material-ui/core/Box";

import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";

import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0
  },
  iconStack: {}
}));

const OutputPathField = props => {
  const classes = useStyles();

  const { value, setValue, jobLabel } = props;

  const handleSelectDirectory = event => {
    if (event.target.files && event.target.files[0]) {
      setValue(event.target.files[0].path);
    }
  };
  const handleEdit = event => {
    setValue(event.target.value);
  };

  return (
    <ListItem dense>
      <TextField
        fullWidth
        // dense
        id="standard-with-placeholder"
        label="Output path"
        placeholder="Override the output path (optional)"
        value={value}
        onChange={handleEdit}
        variant="outlined"
      />

      <Box className={classes.iconStack}>
        <label htmlFor={`${jobLabel}-icon-button-file`}>
          <input
            hidden
            className={classes.input}
            id={`${jobLabel}-icon-button-file`}
            type="file"
            nwdirectory="true"
            onChange={handleSelectDirectory}
          />
          <Tooltip title="Change output directory" placement="top">
            <IconButton
              color="primary"
              className={classes.button}
              aria-label="Upload picture"
              component="span"
              size="small"
            >
              <FolderIcon />
            </IconButton>
          </Tooltip>
        </label>
      </Box>
    </ListItem>
  );
};

OutputPathField.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  jobLabel: PropTypes.string.isRequired
};

export default OutputPathField;
