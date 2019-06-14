import { connect } from "react-redux";
import CtDownloaderFormDrawer from "./CtDownloaderFormDrawer";
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

const CtDownloaderFormDrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CtDownloaderFormDrawer);

export default CtDownloaderFormDrawerContainer;
