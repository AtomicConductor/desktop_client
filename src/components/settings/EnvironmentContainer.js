import { connect } from "react-redux";
import Environment from "./Environment";
// import { toggleDrawer } from "../../_actions/ui";

const mapStateToProps = (state, ownProps) => {
  return {
    environment: state.environment
  };
};

const EnvironmentContainer = connect(mapStateToProps)(Environment);

export default EnvironmentContainer;
