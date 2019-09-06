import { connect } from "react-redux";
import FilterDrawer from "./FilterDrawer";
import { fetchJobs } from "../../_actions/jobs";

const mapStateToProps = (state, ownProps) => {
  return {
    drawerIsOpen: state.downloader.drawerOpen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    refreshJobList: () => dispatch(fetchJobs())
  };
};

const FilterDrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterDrawer);

export default FilterDrawerContainer;
