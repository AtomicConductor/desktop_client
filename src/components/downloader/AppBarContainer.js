import { connect } from "react-redux";
import AppBar from "./AppBar";
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

const AppBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar);

export default AppBarContainer;
