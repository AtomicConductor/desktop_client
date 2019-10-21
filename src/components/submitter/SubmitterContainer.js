import { connect } from "react-redux";
import Submitter from "./Submitter";
import { fetchProjects, fetchInstanceTypes } from "../../_actions/submitter";
import { signedInSelector } from "../../selectors/account";

const mapStateToProps = (state, ownProps) => {
  const loggedIn = signedInSelector(state);

  return {
    loggedIn,
    projects: state.submitter.projects,
    instanceTypes: state.submitter.instanceTypes
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchResources: () => {
      dispatch(fetchProjects());
      dispatch(fetchInstanceTypes());
    }
  };
};

const SubmitterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Submitter);

export default SubmitterContainer;
