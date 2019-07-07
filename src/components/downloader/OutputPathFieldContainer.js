import { connect } from "react-redux";
import OutputPathField from "./OutputPathField";

import { setOutputPathValue, resetOutputPathValue } from "../../_actions/jobs";

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
    },
    resetValue: () => {
      dispatch(resetOutputPathValue({ jobLabel }));
    }
  };
};

const FormOutputPathFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OutputPathField);

export default FormOutputPathFieldContainer;
