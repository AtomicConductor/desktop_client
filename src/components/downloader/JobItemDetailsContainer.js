import { connect } from "react-redux";
import JobItemDetails from "./JobItemDetails";

import { LOADING_KEYS } from "../../_reducers/entities/jobs";

import { updateDownloadFiles } from "../../_actions/files";

const mapStateToProps = (state, ownProps) => {
  const { job } = ownProps;

  let fileCount = 0;
  let existingFileCount = 0;
  let percentageExist = 0;
  let errorCount = 0;

  if (job.files) {
    const vals = Object.values(job.files);
    fileCount = vals.length;
    existingFileCount = vals.filter(v => v && v.exists === 100).length;

    if (fileCount > 0) {
      vals.forEach(v => {
        const ptg = v && v.exists;
        if (ptg > 0) {
          percentageExist += ptg;
        }
      });
      percentageExist = parseInt((percentageExist * 1.0) / fileCount, 10);
    }
    errorCount = vals.filter(v => v && v.exists === -1).length;
  }
  const { outputPath, jobLabel } = job;

  const loadingKey = job.loadingKey || LOADING_KEYS.NONE;

  return {
    fileCount,
    existingFileCount,
    percentageExist,
    errorCount,
    outputPath,
    jobLabel,
    loadingKey
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { jobLabel } = ownProps.job;
  return {
    fetchFilesInfo: () => {
      dispatch(updateDownloadFiles(jobLabel));
    }
  };
};

const JobItemDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItemDetails);

export default JobItemDetailsContainer;
