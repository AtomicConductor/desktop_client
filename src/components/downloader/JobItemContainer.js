import { connect } from "react-redux";
import JobItem from "./JobItem";
import { addToQueue } from "../../_actions/files";
import { LOADING_KEYS } from "../../_reducers/entities/jobs";
import { setExpanded } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  return {
    loadingKey: ownProps.job.loadingKey || LOADING_KEYS.NONE,
    expanded: state.downloader.expandedJob
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { jobLabel } = ownProps.job;
  return {
    addToQueue: () => {
      dispatch(addToQueue(jobLabel));
    },
    onPanelClick: panel => (event, newExpanded) => {
      console.log("onPanelClick" + panel + "   " + newExpanded);
      dispatch(setExpanded(newExpanded ? panel : ""));
    }
  };
};

const JobItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItem);

export default JobItemContainer;
