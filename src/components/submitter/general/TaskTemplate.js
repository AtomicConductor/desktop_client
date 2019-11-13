import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import {
  BookmarkBorderRounded,
  BookmarksRounded,
  CodeRounded,
  BookmarkRounded
} from "@material-ui/icons";

import {
  Box,
  Paper,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  ListItemText
} from "@material-ui/core";

import {
  setTaskTemplate,
  insertTaskTemplateToken
} from "../../../_actions/submitter";
import clsx from "clsx";
import { taskTemplateTokens } from "../../../_helpers/constants";
import {
  presetsSelector,
  selectedPresetSelector
} from "../../../selectors/entities";
import {
  savePreset,
  selectPreset,
  deletePreset
} from "../../../_actions/entities";
import SaveSnippet from "./SaveSnippet";

const useStyles = makeStyles(theme => ({
  dominantPaper: {
    flexBasis: "100%"
  },
  taskToolbar: {
    height: theme.spacing(4),
    padding: "0px 8px",
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    justifyContent: "space-between"
  },
  taskTemplateContainer: {
    flexBasis: "100%"
  },
  taskMain: {
    display: "flex"
  },
  taskTemplateInput: {
    padding: "2px 4px",
    flexGrow: 1,
    fontFamily: "Courier New"
  },
  icon: {
    margin: 0,
    padding: 0,
    paddingLeft: theme.spacing(2),
    borderRadius: 0,
    flexShrink: 0
  },
  spacer: {
    display: "flex",
    flexGrow: "1"
  }
}));

export default () => {
  const [tokensListAnchor, setTokensListAnchor] = useState(null);
  const [taskTempaltesListAnchor, setTaskTempaltesListAnchor] = useState(null);
  const [saveSnippetFormOpen, setSaveSnippetFormOpen] = useState(false);
  const taskTemplateInputRef = useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { taskTemplate } = useSelector(state => state.submitter.submission);
  const taskTemplates = useSelector(presetsSelector);
  const selectedPreset = useSelector(selectedPresetSelector);

  return (
    <Box className={classes.taskTemplateContainer}>
      <Paper className={clsx(classes.dominantPaper)}>
        <Box className={clsx(classes.taskToolbar)}>
          <IconButton
            className={classes.icon}
            color="primary"
            onClick={e => setTokensListAnchor(e.currentTarget)}
          >
            <CodeRounded fontSize="small" />
          </IconButton>
          <div className={classes.spacer} />
          <IconButton
            className={classes.icon}
            color="primary"
            onClick={e => setTaskTempaltesListAnchor(e.currentTarget)}
          >
            <BookmarksRounded fontSize="small" />
          </IconButton>
          <IconButton
            className={classes.icon}
            disabled={!selectedPreset || selectedPreset.readonly}
            color="primary"
            onClick={e => {
              dispatch(setTaskTemplate(""));
              dispatch(deletePreset());
            }}
          >
            <BookmarkBorderRounded fontSize="small" />
          </IconButton>
          <IconButton
            className={classes.icon}
            color="primary"
            onClick={() => setSaveSnippetFormOpen(true)}
          >
            <BookmarkRounded fontSize="small" />
          </IconButton>
        </Box>
        <Box className={clsx(classes.taskMain)}>
          <InputBase
            inputRef={taskTemplateInputRef}
            value={taskTemplate}
            onKeyDown={e => {
              const returnKeyCode = 13;
              if (e.keyCode === returnKeyCode) {
                e.preventDefault();
              }
            }}
            onChange={e => dispatch(setTaskTemplate(e.target.value))}
            multiline
            rows={6}
            className={classes.taskTemplateInput}
            placeholder="kick -nstdin -i /path/to/myfile.<chunk_start>.ass -dw -dp -v 5"
          />
        </Box>
      </Paper>
      <Menu
        anchorEl={tokensListAnchor}
        keepMounted
        open={Boolean(tokensListAnchor)}
        onClick={e => {
          setTokensListAnchor(null);
        }}
      >
        {taskTemplateTokens.map((token, index) => (
          <MenuItem
            key={index}
            onClick={async () => {
              setTokensListAnchor(null);

              const textarea = taskTemplateInputRef.current;
              const { selectionStart: start, selectionEnd: end } = textarea;

              await dispatch(insertTaskTemplateToken({ token, start, end }));

              textarea.focus();
              const bracketsWidth = 2;
              const updatedCursorPosition =
                start + token.length + bracketsWidth;
              textarea.selectionEnd = updatedCursorPosition;
            }}
          >
            {token}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={taskTempaltesListAnchor}
        keepMounted
        open={Boolean(taskTempaltesListAnchor)}
        onClick={e => setTaskTempaltesListAnchor(null)}
      >
        {Object.keys(taskTemplates).map((key, index) => {
          const { command } = taskTemplates[key];
          return (
            <MenuItem
              key={index}
              onClick={e => {
                setTaskTempaltesListAnchor(null);
                dispatch(selectPreset(key));
                dispatch(setTaskTemplate(command));
              }}
            >
              <ListItemText>{key}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>

      <SaveSnippet
        open={saveSnippetFormOpen}
        onClose={() => setSaveSnippetFormOpen(false)}
        onSave={name =>
          dispatch(
            savePreset({
              name,
              command: taskTemplate
            })
          )
        }
      />
    </Box>
  );
};
