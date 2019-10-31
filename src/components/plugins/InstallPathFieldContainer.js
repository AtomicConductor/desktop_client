import { connect } from "react-redux";
import InstallPathField from "./InstallPathField";

import {
  setInstallPathValue,
  resetInstallPathValue
} from "../../_actions/plugins";

const mapStateToProps = (state, ownProps) => {
  const { pluginName } = ownProps;

  const { defaultInstallDirectory, installDirectory } = state.plugins.items[
    pluginName
  ];

  return {
    resettable: Boolean(
      installDirectory && installDirectory !== defaultInstallDirectory
    ),
    value: installDirectory || "none"
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValue: (pluginName, value) => {
      dispatch(setInstallPathValue({ pluginName, value }));
    },
    resetValue: pluginName => {
      dispatch(resetInstallPathValue({ pluginName }));
    }
  };
};

const InstallPathFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallPathField);

export default InstallPathFieldContainer;
