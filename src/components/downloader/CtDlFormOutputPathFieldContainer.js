import { connect } from "react-redux";
import CtDlFormOutputPathField from "./CtDlFormOutputPathField";
import { setOutputPathValue } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.downloader.outputPathValue
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValue: value => {
      dispatch(setOutputPathValue(value));
    }
  };
};

const CtDlFormOutputPathFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CtDlFormOutputPathField);

export default CtDlFormOutputPathFieldContainer;
