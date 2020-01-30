import React from "react";
import PropTypes from "prop-types";

import { makeStyles, fade } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ClearIcon from "@material-ui/icons/Clear";
import { Checkbox } from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";

import FileCopyIcon from "@material-ui/icons/FileCopy";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import Tooltip from "../../app/Tooltip";
import { WarningRounded } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  container: {
    height: 36
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    height: 36,
    backgroundColor: fade(theme.palette.primary[900], 0.3),
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: 0,
    borderRadius: 0,
    alignItems: "center"
  },
  icon: {
    margin: 0,
    marginRight: theme.spacing(2),
    padding: 0,
    borderRadius: 0
  },
  dividerLeft: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    paddingLeft: theme.spacing(2)
  },
  dividerRight: {
    borderRight: `2px solid ${theme.palette.divider}`,
    paddingRight: theme.spacing(2)
  },
  customWidth: {
    maxWidth: 800
  }
}));

const UploadsHeader = props => {
  const classes = useStyles();

  const {
    onBrowseEntries,
    onRemoveEntries,
    onClickCheckbox,
    selectionState,
    missingAssets,
    onRemoveMissingAssets
  } = props;

  const handleAddFiles = e => {
    onBrowseEntries(e.target.files);
  };

  return (
    <Box className={classes.container}>
      <Paper className={classes.header}>
        {missingAssets && (
          <Tooltip title="Remove missing assets">
            <IconButton
              color="primary"
              className={clsx(classes.icon, classes.dividerRight)}
              aria-label="remove missing assets"
              component="span"
              size="small"
              onClick={onRemoveMissingAssets}
            >
              <WarningRounded />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Select or deselect all assets in the list.">
          <Checkbox
            color="primary"
            checked={selectionState !== "none"}
            size="small"
            className={classes.icon}
            value="selected"
            indeterminate={selectionState === "some"}
            onClick={onClickCheckbox}
          />
        </Tooltip>
        <Tooltip title="Remove selected assets from the list.">
          <IconButton
            className={classes.icon}
            aria-label="clear"
            color="primary"
            onClick={onRemoveEntries}
            size="small"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>

        <label htmlFor={"browse-upload-files-button"}>
          <input
            hidden
            multiple
            id={"browse-upload-files-button"}
            type="file"
            onChange={handleAddFiles}
          />
          <Tooltip title="Browse for file assets">
            <IconButton
              color="primary"
              className={clsx(classes.icon, classes.dividerLeft)}
              aria-label="File assets"
              component="span"
              size="small"
            >
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        </label>

        <label htmlFor={"browse-upload-directories-button"}>
          <input
            hidden
            multiple
            id={"browse-upload-directories-button"}
            type="file"
            nwdirectory="true"
            nwdirectorydesc="Choose directory assets"
            onChange={handleAddFiles}
          />
          <Tooltip title="Browse for directory assets">
            <IconButton
              color="primary"
              className={classes.icon}
              aria-label="Directory assets"
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
