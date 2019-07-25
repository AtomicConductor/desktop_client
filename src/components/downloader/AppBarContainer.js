import { connect } from "react-redux";
import AppBar from "./AppBar";
import { fetchJobs } from "../../_actions/jobs";
import { setFilterValue, setExpanded } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    filterValue: state.downloader.jobQueryParams.textFilter
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    refreshJobList: () => {
      dispatch(fetchJobs());
      dispatch(setExpanded(""));
    },
    setFilterValue: value => {
      dispatch(setFilterValue({ textFilter: value }));
      dispatch(setExpanded(""));
    }
  };
};

const AppBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar);

export default AppBarContainer;
