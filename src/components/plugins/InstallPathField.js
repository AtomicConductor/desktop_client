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

const InstallPathField = props => {
  const classes = useStyles();

  const { pluginName, value, setValue, resetValue, resettable } = props;

  const handleSelectDirectory = event => {
    console.log("HANDLESELECTDIRECTORY");
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0].path);
      setValue(pluginName, event.target.files[0].path);
    }
  };
  const handleEdit = event => {
    setValue(pluginName, event.target.value);
  };

  return (
    <ListItem>
      <TextField
        fullWidth
        // dense
        id="standard-with-placeholder"
        label="Installation path"
        placeholder="Set the installation path"
        value={value}
        onChange={handleEdit}
        variant="outlined"
        disabled={true}
      />

      <Box className={classes.iconStack}>
        <label htmlFor={`${pluginName}-icon-button-file`}>
          <input
            hidden
            className={classes.input}
            id={`${pluginName}-icon-button-file`}
            type="file"
            nwdirectory="true"
            onChange={handleSelectDirectory}
          />
          <Tooltip title="Change installation directory" placement="top">
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

InstallPathField.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
};

export default InstallPathField;
