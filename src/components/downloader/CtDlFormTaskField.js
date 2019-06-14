import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Autosuggest from "react-autosuggest";

const useStyles = makeStyles(theme => ({
  root: {
    height: 250,
    flexGrow: 1
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  divider: {
    height: theme.spacing(2)
  }
}));

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <ListItem dense>
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input
          }
        }}
        {...other}
      />
    </ListItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  // console.log(suggestion)
  return (
    <MenuItem dense selected={isHighlighted} component="div">
      <div>{suggestion}</div>
    </MenuItem>
  );
}

const CtDlFormTaskField = props => {
  const classes = useStyles();

  const {
    disabled,
    inputValue,
    suggestions,
    setInputValue,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested
  } = props;

  return (
    <Autosuggest
      renderInputComponent={renderInputComponent}
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        classes,
        placeholder: "Leave blank to download all tasks",
        disabled,
        label: "Task Id(s)",
        value: inputValue,
        onChange: setInputValue
      }}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion
      }}
      renderSuggestionsContainer={options => (
        <Paper {...options.containerProps} square>
          {options.children}
        </Paper>
      )}
    />
  );
};

CtDlFormTaskField.propTypes = {
  inputValue: PropTypes.string.isRequired,
  suggestions: PropTypes.array,
  setInputValue: PropTypes.func.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired
};

export default CtDlFormTaskField;
