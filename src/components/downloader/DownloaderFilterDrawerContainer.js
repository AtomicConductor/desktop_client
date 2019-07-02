import { connect } from "react-redux";
import DownloaderFilterDrawer from "./DownloaderFilterDrawer";
import { toggleUseDaemon } from "../../_actions/downloader";
import {
  fetchJobs
  // receiveMockJobs,
  // receiveMockDownloads
} from "../../_actions/jobs";

const mapStateToProps = (state, ownProps) => {
  return {
    drawerIsOpen: state.downloader.drawerOpen,
    useDaemon: state.downloader.useDaemon
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onToggleUseDaemon: () => {
      dispatch(toggleUseDaemon());
    },
    // downloadNext: () => {
    //   dispatch(downloadAFile());
    // },
    refreshJobList: () => dispatch(fetchJobs())
  };
};

const DownloaderFilterDrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloaderFilterDrawer);

export default DownloaderFilterDrawerContainer;
