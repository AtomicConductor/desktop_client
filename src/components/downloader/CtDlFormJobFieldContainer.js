import { connect } from "react-redux";
import CtDlFormJobField from "./CtDlFormJobField";

import {
  setJobValue,
  setJobSuggestions,
  clearJobSuggestions
} from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    suggestions: state.downloader.jobSuggestions,
    inputValue: state.downloader.jobValue
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSuggestionsFetchRequested: params => {
      dispatch(setJobSuggestions(params));
    },
    onSuggestionsClearRequested: () => {
      dispatch(clearJobSuggestions());
    },
    setInputValue: (event, { newValue }) => {
      dispatch(setJobValue(newValue));
    }
  };
};

const CtDlFormJobFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CtDlFormJobField);

export default CtDlFormJobFieldContainer;
