import { connect } from "react-redux";
import SignIn from "./SignIn";
import { signIn } from "../../_actions/profile";

const mapStateToProps = (state, ownProps) => {
  return {
    error: state.profile.error
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSignIn: params => {
      // console.log(params);
      dispatch(signIn(params));
    }
  };
};

const SignInContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);

export default SignInContainer;
