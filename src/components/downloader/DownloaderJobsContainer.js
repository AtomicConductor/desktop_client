import { connect } from "react-redux";
import DownloaderJobs from "./DownloaderJobs";
// import { toggleUseDaemon, runDownloadJobs } from "../../_actions/downloader";
// import { fetchJobs } from "../../_actions/jobs";
const mapStateToProps = (state, ownProps) => {
  const jobs = Object.entries(state.entities.jobs || {})
    //   console.log(jobs);
    .sort((a, b) => b[1]["jobLabel"].localeCompare(a[1]["jobLabel"]))
    .map(j => {
      return { jobLabel: j[1].jobLabel, title: j[1].title };
    });

  return {
    jobs: jobs
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onToggleUseDaemon: () => {
    //   dispatch(toggleUseDaemon());
    // },
    // run: () => {
    //   dispatch(runDownloadJobs());
    // },
    // refreshJobList: () => dispatch(fetchJobs())
  };
};

const DownloaderJobsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloaderJobs);

export default DownloaderJobsContainer;
