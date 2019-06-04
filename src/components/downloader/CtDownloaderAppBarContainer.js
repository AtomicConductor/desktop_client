import { connect } from "react-redux";
import CtDownloaderAppBar from "./CtDownloaderAppBar";
import { dlToggleDrawer } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    drawerIsOpen:  state.downloader.drawerOpen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onToggleDrawer: () => {
      dispatch(dlToggleDrawer());
    }
  };
};

const CtDownloaderAppBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtDownloaderAppBar
);

export default CtDownloaderAppBarContainer;
