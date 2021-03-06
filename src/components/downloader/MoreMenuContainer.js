import { connect } from "react-redux";
import MoreMenu from "./MoreMenu";

import { resetOutputPathValue } from "../../_actions/jobs";

import {
  updateDownloadFiles,
  updateExistingFilesInfo
} from "../../_actions/files";
const mapStateToProps = (state, ownProps) => {
  const { jobLabel } = ownProps;
  const { originalOutputDirectory, outputDirectory } = state.entities.jobs[
    jobLabel
  ];

  return {
    directoryResettable: Boolean(
      outputDirectory && outputDirectory !== originalOutputDirectory
    ),
    outputDirectory
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { jobLabel } = ownProps;
  return {
    resetOutputDirectory: () => {
      dispatch(resetOutputPathValue({ jobLabel }));
      dispatch(updateExistingFilesInfo(jobLabel));
    },
    refreshAll: () => {
      dispatch(updateDownloadFiles(jobLabel));
    }
  };
};

const MoreMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MoreMenu);

export default MoreMenuContainer;
