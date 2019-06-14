import { connect } from "react-redux";
import CtAccountSignIn from "./CtAccountSignIn";
import { fetchProfile } from "../../_actions/profile";

const mapStateToProps = (state, ownProps) => {
  return {
    error: state.profile.error
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSignIn: () => {
      dispatch(fetchProfile());
    }
  };
};

const CtAccountSignInContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CtAccountSignIn);

export default CtAccountSignInContainer;
