import { connect } from "react-redux";
import InstallPathField from "./InstallPathField";

import // setInstallPathValue,
// resetInstallPathValue,
// updateExistingFilesInfo
"../../_actions/jobs";

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const InstallPathFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallPathField);

export default InstallPathFieldContainer;
