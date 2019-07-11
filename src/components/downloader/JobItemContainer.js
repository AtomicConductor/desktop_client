import { connect } from "react-redux";
import JobItem from "./JobItem";
import { addToQueue } from "../../_actions/files";

import { fetchDownloadSummary } from "../../_actions/jobs";
import { LOADING_KEYS } from "../../_reducers/entities/jobs";

const mapStateToProps = (state, ownProps) => {
  const { job } = ownProps;
  const loadingKey = job.loadingKey || LOADING_KEYS.NONE;
  return {
    loadingKey
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { job } = ownProps;
  const { jobLabel } = job;
  return {
    addToQueue: () => {
      dispatch(addToQueue(job.jobLabel));
    },
    fetchFilesInfo: () => {
      dispatch(fetchDownloadSummary(jobLabel));
    }
  };
};

const JobItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItem);

export default JobItemContainer;
