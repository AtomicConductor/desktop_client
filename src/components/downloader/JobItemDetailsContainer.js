import { connect } from "react-redux";
import JobItemDetails from "./JobItemDetails";

import {
  fetchDownloadSummary,
  updateExistingFilesInfo
} from "../../_actions/jobs";

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

  const loadingMessage = job.loadingMessage || "";
  return {
    fileCount,
    existingFileCount,
    outputPath,
    jobLabel,
    loadingMessage
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { jobLabel } = ownProps.job;
  return {
    fetchFilesInfo: () => {
      console.log("-------------");
      console.log("HERE 1");

      dispatch(fetchDownloadSummary(jobLabel));
      console.log("HERE 2");
      // dispatch(updateExistingFilesInfo({ jobLabel }));
      // console.log("HERE 3");
    }
  };
};

const JobItemDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItemDetails);

export default JobItemDetailsContainer;
