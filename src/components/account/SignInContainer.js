import { connect } from "react-redux";
import SignIn from "./SignIn";
import { signIn } from "../../_actions/profile";

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: params => {
      dispatch(signIn(params));
    }
  };
};

const SignInContainer = connect(
  null,
  mapDispatchToProps
)(SignIn);

export default SignInContainer;
