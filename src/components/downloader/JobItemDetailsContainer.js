import { connect } from "react-redux";
import JobItemDetails from "./JobItemDetails";

import { fetchDownloadSummary } from "../../_actions/jobs";

const mapStateToProps = (state, ownProps) => {
  const { job } = ownProps;

  return {
    fileCount: state.entities.jobs[job.jobLabel].fileCount || 0,
    existingFileCount: state.entities.jobs[job.jobLabel].existingFileCount || 0,
    outputPath: state.entities.jobs[job.jobLabel].outputPath || "",
    jobLabel: job.jobLabel,
    loading: state.entities.jobs[job.jobLabel].loadingFileData !== false
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const jobLabel = ownProps.job.jobLabel;
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
