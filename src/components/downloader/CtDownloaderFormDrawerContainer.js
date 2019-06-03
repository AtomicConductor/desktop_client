import { connect } from "react-redux";
import CtDownloaderFormDrawer from "./CtDownloaderFormDrawer";
import { toggleDrawer } from "../../actions/ui";

const mapStateToProps = (state, ownProps) => {
  return {
    drawerIsOpen:  state.ui.downloader.drawerOpen
  };
};
 

const CtDownloaderFormDrawerContainer = connect(mapStateToProps)(
  CtDownloaderFormDrawer
);

export default CtDownloaderFormDrawerContainer;
