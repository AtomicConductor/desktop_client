import { connect } from "react-redux";
import FilterDrawer from "./FilterDrawer";
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

const FilterDrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterDrawer);

export default FilterDrawerContainer;
