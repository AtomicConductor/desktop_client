import { connect } from "react-redux";
import CtDlFormJobField from "./CtDlFormJobField";
 
import {
setJobInputValue,
setJobSuggestions,
clearJobSuggestions
} from "../../_actions/downloader";


const mapStateToProps = (state, ownProps) => {
  return {
    suggestions:  state.downloader.jobSuggestions,
    inputValue: state.downloader.jobInputValue
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
      dispatch(setJobInputValue(newValue));
    }
  };
};

const CtDlFormJobFieldContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtDlFormJobField
);

export default CtDlFormJobFieldContainer;
