import { connect } from "react-redux";
import JobItem from "./JobItem";
import { addToQueue } from "../../_actions/files";
import { LOADING_KEYS } from "../../_reducers/entities/jobs";

const mapStateToProps = (state, ownProps) => {
  return {
    loadingKey: ownProps.job.loadingKey || LOADING_KEYS.NONE
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { jobLabel } = ownProps.job;
  return {
    addToQueue: () => {
      dispatch(addToQueue(jobLabel));
    }
  };
};

const JobItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItem);

export default JobItemContainer;
