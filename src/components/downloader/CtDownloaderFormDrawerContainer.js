import { connect } from "react-redux";
import CtDownloaderFormDrawer from "./CtDownloaderFormDrawer";
import { dlToggleUseDaemon } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    drawerIsOpen:  state.downloader.drawerOpen,
    useDaemon: state.downloader.useDaemon,
  };
};
 
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onToggleUseDaemon: () => {
      dispatch(dlToggleUseDaemon());
    }
  };
};
 


const CtDownloaderFormDrawerContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtDownloaderFormDrawer
);

export default CtDownloaderFormDrawerContainer;
