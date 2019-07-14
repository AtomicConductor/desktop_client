import { connect } from "react-redux";
import Edit from "./Edit";
import { writeSettings } from "../../_actions/environment";
import { signOut } from "../../_actions/profile";

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.environment.settings
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSave: settings => {
      dispatch(signOut());
      dispatch(writeSettings(settings));
    }
  };
};

const EditContainerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);

export default EditContainerContainer;
