import { connect } from "react-redux";
import PluginItem from "./PluginItem";
import { installPlugin, uninstallPlugin } from "../../_actions/plugins";

const mapDispatchToProps = (dispatch, ownProps) => {
  const { name } = ownProps.plugin;
  return {
    install: () => {
      dispatch(installPlugin(name));
    },
    uninstall: () => {
      dispatch(uninstallPlugin(name));
    }
  };
};

const PluginItemContainer = connect(
  null,
  mapDispatchToProps
)(PluginItem);

export default PluginItemContainer;
