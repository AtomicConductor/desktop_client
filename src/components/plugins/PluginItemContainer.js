import PluginItem from "./PluginItem";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const PluginItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PluginItem);

export default PluginItemContainer;
