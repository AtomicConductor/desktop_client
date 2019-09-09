import { connect } from "react-redux";
import JobItem from "./JobItem";
import { addToQueue, updateExistingFilesInfo } from "../../_actions/files";
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
    onPanelClick: jobLabel => (event, isExpanded) => {
      dispatch(setExpanded(isExpanded ? jobLabel : ""));
      dispatch(updateExistingFilesInfo());
    }
  };
};

const JobItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobItem);

export default JobItemContainer;
