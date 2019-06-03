import { connect } from "react-redux";
import CtUploaderAppBar from "./CtUploaderAppBar";
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

const CtUploaderAppBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtUploaderAppBar
);

export default CtUploaderAppBarContainer;
