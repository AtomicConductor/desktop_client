import Plugins from "./Plugins";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
  const plugins = Object.values(state.plugins.items).sort((a, b) =>
    a["order"] < b["order"] ? -1 : 1
  );

  return {
    plugins
  };
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {};
// };

const PluginsContainer = connect(
  mapStateToProps
  // mapDispatchToProps
)(Plugins);

export default PluginsContainer;
