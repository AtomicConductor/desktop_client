import { connect } from "react-redux";
import CtAppBar from "./CtAppBar";
import { toggleDrawer } from "../actions/ui";

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

const CtAppBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtAppBar
);

export default CtAppBarContainer;
