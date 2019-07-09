import { connect } from "react-redux";
import OutputPathField from "./OutputPathField";

import {
  setOutputPathValue,
  resetOutputPathValue,
  updateExistingFilesInfo
} from "../../_actions/jobs";

const mapStateToProps = (state, ownProps) => {
  const { jobLabel } = ownProps;
  const { originalOutputDirectory, outputDirectory } = state.entities.jobs[
    jobLabel
  ];

  return {
    resettable: Boolean(
      outputDirectory && outputDirectory !== originalOutputDirectory
    ),
    value: outputDirectory || ""
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { jobLabel } = ownProps;
  return {
    setValue: value => {
      dispatch(setOutputPathValue({ jobLabel, value }));
      dispatch(updateExistingFilesInfo({ jobLabel }));
    },
    resetValue: () => {
      dispatch(resetOutputPathValue({ jobLabel }));
      dispatch(updateExistingFilesInfo({ jobLabel }));
    }
  };
};

const FormOutputPathFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OutputPathField);

export default FormOutputPathFieldContainer;
