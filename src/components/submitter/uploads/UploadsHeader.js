import React from "react";
import PropTypes from "prop-types";

import { makeStyles, fade } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ClearIcon from "@material-ui/icons/Clear";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
  container: {
    height: 28
  },
  browseButtonGroup: {},
  select: {
    border: "1px solid green"
  },
  deselect: {
    border: "1px solid red"
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    height: 28,
    backgroundColor: fade(theme.palette.primary[800], 0.6),
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: 0,
    borderRadius: 0
  },
  icon: {
    margin: 0,
    marginRight: theme.spacing(2),
    padding: 0,
    borderRadius: 0
  }
}));

const UploadsHeader = props => {
  const classes = useStyles();

  const {
    onBrowseEntries,
    onRemoveEntries,
    onClickCheckbox,
    selectionState
  } = props;

  const handleAddFiles = e => {
    onBrowseEntries(e.target.files);
  };

  return (
    <Box className={classes.container}>
      <Paper className={classes.header}>
        <Checkbox
          checked={selectionState !== "none"}
          size="small"
          className={classes.icon}
          value="selected"
          indeterminate={selectionState === "some"}
          color="primary"
          onClick={onClickCheckbox}
          inputProps={{
            "aria-label": "secondary checkbox"
          }}
        />

        <IconButton
          className={classes.icon}
          aria-label="clear"
          color="primary"
          onClick={onRemoveEntries}
          size="small"
        >
          <ClearIcon />
        </IconButton>

        <label htmlFor={"browse-upload-files-button"}>
          <input
            hidden
            multiple
            id={"browse-upload-files-button"}
            type="file"
            onChange={handleAddFiles}
          />
          <Tooltip title="Browse for upload files" placement="top">
            <IconButton
              color="primary"
              className={classes.icon}
              aria-label="Upload files"
              component="span"
              size="small"
            >
              <FolderIcon />
            </IconButton>
          </Tooltip>
        </label>
      </Paper>
    </Box>
  );
};

UploadsHeader.propTypes = {
  onBrowseEntries: PropTypes.func.isRequired,
  onRemoveEntries: PropTypes.func.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  selectionState: PropTypes.oneOf(["none", "some", "all"]).isRequired
};

export default UploadsHeader;
