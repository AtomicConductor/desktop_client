import { connect } from "react-redux";
import OutputPathField from "./OutputPathField";
// import { setOutputPathValue } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    // value: state.downloader.outputPathValue
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // setValue: value => {
    //   dispatch(setOutputPathValue(value));
    // }
  };
};

const FormOutputPathFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OutputPathField);

export default FormOutputPathFieldContainer;
