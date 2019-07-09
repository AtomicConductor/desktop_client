import { connect } from "react-redux";
import JobItem from "./JobItem";
import { addToQueue } from "../../_actions/files";

const mapDispatchToProps = (dispatch, ownProps) => {
  const { job } = ownProps;
  return {
    addToQueue: () => {
      dispatch(addToQueue(job.jobLabel));
    }
  };
};

const JobItemContainer = connect(
  null,
  mapDispatchToProps
)(JobItem);

export default JobItemContainer;
