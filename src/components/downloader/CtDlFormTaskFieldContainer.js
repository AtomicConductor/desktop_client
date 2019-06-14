import { connect } from "react-redux";
import CtDlFormTaskField from "./CtDlFormTaskField";

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

const CtDlFormTaskFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CtDlFormTaskField);

export default CtDlFormTaskFieldContainer;
