import { connect } from "react-redux";
import Downloader from "./Downloader";
import { fetchJobs } from "../../_actions/jobs";
import moment from "moment";
import { signedInSelector } from "../../selectors/account";

const matches = (text, job) => {
  if (job.jobLabel.toLowerCase().includes(text)) {
    return true;
  }
  if (job.title && job.title.toLowerCase().includes(text)) {
    return true;
  }
  if (job.owner && job.owner.toLowerCase().includes(text)) {
    return true;
  }
  if (job.location && job.location.toLowerCase().includes(text)) {
    return true;
  }
  if (
    job.project &&
    job.project
      .split("|")
      .reverse()[0]
      .toLowerCase()
      .includes(text)
  ) {
    return true;
  }
  return false;
};

const mapStateToProps = (state, ownProps) => {
  const loggedIn = signedInSelector(state);

  const textFilter = state.downloader.jobQueryParams.textFilter
    .trim()
    .toLowerCase();

  let jobs;
  if (textFilter) {
    jobs = Object.values(state.entities.jobs || {}).filter(job => {
      return matches(textFilter, job);
    });
  } else {
    jobs = Object.values(state.entities.jobs || {});
  }
  jobs = jobs.sort((a, b) =>
    moment(b["created"]) < moment(a["created"]) ? -1 : 1
  );

  return {
    loggedIn,
    jobs: jobs,
    loading: state.downloader.loadingJobs
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchJobs: keys => {
      dispatch(fetchJobs());
    }
  };
};

const DownloaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Downloader);

export default DownloaderContainer;
