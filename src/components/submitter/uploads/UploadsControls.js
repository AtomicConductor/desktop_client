import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";

import Tooltip from "@material-ui/core/Tooltip";

// Use this later to select and deselect the list - or
// figure out how to do it on checkbox select/deselect.

//   import { SelectAll, DeselectAll } from "react-selectable-fast";

//   <SelectAll className="selectable-button">
//     <button>Select all</button>
//   </SelectAll>
//   <DeselectAll className="selectable-button">
//     <button>Clear selection</button>
//   </DeselectAll>

const useStyles = makeStyles(theme => ({
  container: { marginRight: theme.spacing(1) },
  browseButtonGroup: {},
  button: {}
}));

const UploadsControls = props => {
  const classes = useStyles();

  const [state, setState] = React.useState(0);

  const handleSelected = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const handleSelectFiles = () => {
    console.log("SELECT FILES");
  };

  return (
    <Box className={classes.container}>
      <Checkbox
        checked={state.selected}
        onChange={handleSelected("selected")}
        value="selected"
        indeterminate
        color="primary"
        inputProps={{
          "aria-label": "secondary checkbox"
        }}
      />

      <IconButton
        className={classes.button}
        aria-label="clear"
        disabled
        color="primary"
      >
        <ClearIcon />
      </IconButton>

      <label htmlFor={"browse-upload-files-button"}>
        <input
          hidden
          multiple
          id={"browse-upload-files-button"}
          type="file"
          onChange={handleSelectFiles}
        />
        <Tooltip title="Browse for upload files" placement="top">
          <IconButton
            color="primary"
            className={classes.button}
            aria-label="Upload files"
            component="span"
            size="small"
          >
            <FolderIcon />
          </IconButton>
        </Tooltip>
      </label>
    </Box>
  );
};

export default UploadsControls;
