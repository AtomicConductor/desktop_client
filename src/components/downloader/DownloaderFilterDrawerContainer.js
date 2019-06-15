import { connect } from "react-redux";
import DownloaderFilterDrawer from "./DownloaderFilterDrawer";
import { toggleUseDaemon, runDownloadJobs } from "../../_actions/downloader";
import { fetchJobs } from "../../_actions/jobs";
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
    run: () => {
      dispatch(runDownloadJobs());
    },
    refreshJobList: () => dispatch(fetchJobs())
  };
};

const DownloaderFilterDrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloaderFilterDrawer);

export default DownloaderFilterDrawerContainer;
