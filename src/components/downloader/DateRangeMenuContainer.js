import { connect } from "react-redux";
import DateRangeMenu from "./DateRangeMenu";

import { fetchJobs, setJobQuery } from "../../_actions/jobs";

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchJobsInSpan: span => {
      dispatch(setJobQuery({ span }));
      dispatch(fetchJobs());
    }
  };
};

const DateRangeMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DateRangeMenu);

export default DateRangeMenuContainer;
