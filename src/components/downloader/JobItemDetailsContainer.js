import { connect } from "react-redux";
import JobItemDetails from "./JobItemDetails";

import { fetchDownloadSummary } from "../../_actions/jobs";

import { LOADING_KEYS } from "../../_reducers/entities/jobs";

const mapStateToProps = (state, ownProps) => {
  const { job } = ownProps;

  let fileCount = 0;
  let existingFileCount = 0;
  if (job.files) {
    const vals = Object.values(job.files);
    fileCount = vals.length;
    existingFileCount = vals.filter(v => v && v.exists).length;
  }
  const { outputPath, jobLabel } = job;

  const loadingKey = job.loadingKey || LOADING_KEYS.NONE;
  return {
    fileCount,
    existingFileCount,
    outputPath,
    jobLabel,
    loadingKey
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { jobLabel } = ownProps.job;
  return {
    fetchFilesInfo: () => {
      dispatch(fetchDownloadSummary(jobLabel));
    }
  };
};

const JobItemDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItemDetails);

export default JobItemDetailsContainer;
