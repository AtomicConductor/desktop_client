import { connect } from "react-redux";
import DownloaderJobItemDetails from "./DownloaderJobItemDetails";

import { fetchDownloadFiles } from "../../_actions/jobs";

const mapStateToProps = (state, ownProps) => {
  const { job } = ownProps;

  return {
    filesInfo: state.entities.jobs[job.jobLabel].files || {}
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const jobLabel = ownProps.job.jobLabel;
  return {
    fetchFilesInfo: () => {
      dispatch(fetchDownloadFiles(jobLabel));
    }
  };
};

const DownloaderJobItemDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloaderJobItemDetails);

export default DownloaderJobItemDetailsContainer;
