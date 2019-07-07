import { connect } from "react-redux";
import Jobs from "./Jobs";
import { addResourcesToQueue } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
  const jobs = Object.values(state.entities.jobs || {}).sort((a, b) =>
    b["jobLabel"].localeCompare(a["jobLabel"])
  );
  // .map(j => {
  //   return { jobLabel: j[1].jobLabel, title: j[1].title };
  // });

  return {
    jobs: jobs,
    loading: state.downloader.loadingJobs
  };
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     addToQueue: keys => {
//       dispatch(addResourcesToQueue(keys));
//     }
//   };
// };

const JobsContainer = connect(
  mapStateToProps
  // mapDispatchToProps
)(Jobs);

export default JobsContainer;
