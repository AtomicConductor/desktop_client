import React, { useRef } from "react";
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

const useStyles = makeStyles(theme => ({
  dominantPaper: {
    flexBasis: "100%"
  },
  taskToolbar: {
    padding: "2px 8px",
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
  }
}));

export default props => {
  const [tokensListAnchor, setTokensListAnchor] = React.useState(null);
  const [taskTempaltesListAnchor, setTaskTempaltesListAnchor] = React.useState(
    null
  );
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
            color="primary"
            onClick={e => setTokensListAnchor(e.currentTarget)}
          >
            <CodeRounded />
          </IconButton>
          <div>
            <IconButton
              color="primary"
              onClick={e => setTaskTempaltesListAnchor(e.currentTarget)}
            >
              <BookmarksRounded />
            </IconButton>
            <IconButton
              disabled={!selectedPreset || selectedPreset.readonly}
              color="primary"
              onClick={e => {
                dispatch(setTaskTemplate(""));
                dispatch(deletePreset());
              }}
            >
              <BookmarkBorderRounded />
            </IconButton>
            <IconButton
              color="primary"
              onClick={e => {
                const name = prompt("Enter a name for you custom command:");
                if (!name) return;
                dispatch(
                  savePreset({
                    name,
                    command: taskTemplate
                  })
                );
              }}
            >
              <BookmarkRounded />
            </IconButton>
          </div>
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
    </Box>
  );
};
