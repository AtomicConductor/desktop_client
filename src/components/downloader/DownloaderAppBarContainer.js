import { connect } from "react-redux";
import DownloaderAppBar from "./DownloaderAppBar";
import { toggleDrawer } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    drawerIsOpen: state.downloader.drawerOpen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onToggleDrawer: () => {
      dispatch(toggleDrawer());
    }
  };
};

const DownloaderAppBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloaderAppBar);

export default DownloaderAppBarContainer;
