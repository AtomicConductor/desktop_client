import { connect } from "react-redux";
import FormTaskField from "./FormTaskField";

import {
  setTaskValue,
  setTaskSuggestions,
  clearTaskSuggestions
} from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    suggestions: state.downloader.taskSuggestions,
    inputValue: state.downloader.taskValue
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSuggestionsFetchRequested: params => {
      dispatch(setTaskSuggestions(params));
    },
    onSuggestionsClearRequested: () => {
      dispatch(clearTaskSuggestions());
    },
    setInputValue: (event, { newValue }) => {
      dispatch(setTaskValue(newValue));
    }
  };
};

const FormTaskFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormTaskField);

export default FormTaskFieldContainer;
