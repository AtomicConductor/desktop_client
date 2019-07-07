import { connect } from "react-redux";
import JobItem from "./JobItem";
import { addToQueue } from "../../_actions/files";

const mapStateToProps = (state, ownProps) => {
  // const { job } = ownProps;

  return {
    // projectLabel: job.projectId.split("|").reverse()[0],
    // jobLabel: job.jobLabel
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { job } = ownProps;
  return {
    addToQueue: () => {
      dispatch(addToQueue(job.jobLabel));
    }
  };
};

const JobItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItem);

export default JobItemContainer;
