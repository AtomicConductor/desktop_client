import { connect } from "react-redux";
import CtDashboardAppBar from "./CtDashboardAppBar";
// import { toggleDrawer } from "../../_actions/ui";

const mapStateToProps = (state, ownProps) => {
  return { 
    // drawerIsOpen:  state.ui.downloader.drawerOpen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onToggleDrawer: () => {
    //   dispatch(toggleDrawer());
    // }
  };
};

const CtDashboardAppBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  CtDashboardAppBar
);

export default CtDashboardAppBarContainer;
