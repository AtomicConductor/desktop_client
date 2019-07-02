import { connect } from "react-redux";
import DownloaderJobItem from "./DownloaderJobItem";
import { addResourcesToQueue, add } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  // const { job } = ownProps;

  return {
    // projectLabel: job.projectId.split("|").reverse()[0],
    // jobLabel: job.jobLabel
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // addToQueue: keys => {
    //   dispatch(addResourcesToQueue(keys));
    // }
  };
};

const DownloaderJobItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloaderJobItem);

export default DownloaderJobItemContainer;
