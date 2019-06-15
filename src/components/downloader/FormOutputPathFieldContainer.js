import { connect } from "react-redux";
import FormOutputPathField from "./FormOutputPathField";
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

const FormOutputPathFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormOutputPathField);

export default FormOutputPathFieldContainer;
