import { connect } from "react-redux";
import CtDownloaderAppBar from "./CtDownloaderAppBar";
import { toggleDrawer } from "../../actions/ui";

const mapStateToProps = (state, ownProps) => {
  return {
    drawerIsOpen:  state.ui.downloader.drawerOpen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onToggleDrawer: () => {
      dispatch(toggleDrawer());
    }
  };
};

const CtDownloaderAppBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtDownloaderAppBar
);

export default CtDownloaderAppBarContainer;
