import { connect } from "react-redux";
import CtSettingsEnvironment from "./CtSettingsEnvironment";
// import { toggleDrawer } from "../../_actions/ui";

const mapStateToProps = (state, ownProps) => {
  return {
    environment: state.environment
  };
};

const CtSettingsEnvironmentContainer = connect(mapStateToProps)(
  CtSettingsEnvironment
);

export default CtSettingsEnvironmentContainer;
