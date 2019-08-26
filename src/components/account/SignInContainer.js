import { connect } from "react-redux";
import SignIn from "./SignIn";
import { signIn } from "../../_actions/profile";
import { config } from '../../_helpers/constants';

const mapStateToProps = (state, ownProps) => {
  return {
    error: state.profile.error,
    googleClientId: config.googleClientId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSignIn: params => {
      dispatch(signIn(params));
    }
  };
};

const SignInContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);

export default SignInContainer;
