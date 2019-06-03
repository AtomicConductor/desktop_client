import { connect } from "react-redux";
import CtPluginsAppBar from "./CtPluginsAppBar";
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

const CtPluginsAppBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtPluginsAppBar
);

export default CtPluginsAppBarContainer;
