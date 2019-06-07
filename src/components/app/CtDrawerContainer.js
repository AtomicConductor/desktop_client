import { connect } from "react-redux";
import CtDrawer from "./CtDrawer";

const mapStateToProps = (state, ownProps) => {
  return {
    profile: state.profile
  };
};

const CtDrawerContainer = connect(mapStateToProps)(CtDrawer);

export default CtDrawerContainer;
