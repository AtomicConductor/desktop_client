import { createAction } from "redux-starter-kit";
import { setNotification } from "./notification";
import { createRequestOptions } from "../_helpers/network";
import path from "upath";
import open from "open";
import moment from "moment";
import { checkResponse } from "../_helpers/network";
import {
  directoryExistsSync,
  exactFileExistsSync
} from "../_helpers/fileSystem";

import { TIMESPANS } from "../_helpers/constants";

export const requestJobs = createAction("downloader/requestJobs");
export const receiveJobs = createAction("downloader/receiveJobs");

// export const requestJob = createAction("downloader/requestJob");
export const setOutputPathValue = createAction("downloader/setOutputPathValue");
export const resetOutputPathValue = createAction(
  "downloader/resetOutputPathValue"
);

// export const endDownloadRequest = createAction("downloader/endDownloadRequest");
export const setFileExists = createAction("downloader/setFileExists");
export const requestDownloadData = createAction(
  "downloader/requestDownloadData"
);
export const receiveDownloadSummary = createAction(
  "downloader/receiveDownloadSummary"
);

export const requestExistingFilesInfo = createAction(
  "downloader/requestExistingFilesInfo"
);

export const receiveExistingFilesInfo = createAction(
  "downloader/receiveExistingFilesInfo"
);

export const setJobQuery = createAction("downloader/setJobQuery");

/*
Takes an array of objects whose keys are IDs, and returns the 
Id of the Nth item 
*/
// const getPartitionId = (data, n) => {
//   const sorted = data.map(o => Object.keys(o)[0]).sort();
//   if (data.length <= n) {
//     return sorted[0] - 1;
//   }
//   return sorted.reverse()[n];
// };

/*
Example params object

const params = {
  filters: [  status_lt_gyu,  role_eq_dhfjh ] ,
  limit: 200,
  fields: ["lastname", "firstname"],
}
*/

// function constructJobsQuery(state) {
//   console.log(state.profile);
//   const accountId = state.profile.user.data.account;
//   const queryParams = state.downloader.jobQueryParams;
//   const foo = "";
// }

function spanToDateFilters(key, span) {
  let d0, d1;

  // console.log("spanToDateFilters" + span);

  // result = [];
  switch (span) {
    case TIMESPANS.TODAY:
      return [`${key}_gt_${moment.utc().format("YYYY-MM-DD")}`];
    case TIMESPANS.THISWEEK:
      return [
        `${key}_gt_${moment
          .utc()
          .startOf("week")
          .format("YYYY-MM-DD")}`
      ];
    case TIMESPANS.LASTWEEK:
      const lastweek = moment.utc().subtract(7, "days");
      return [
        `${key}_gt_${lastweek.startOf("week").format("YYYY-MM-DD")}`,
        `${key}_lt_${lastweek.endOf("week").format("YYYY-MM-DD")}`
      ];
    case TIMESPANS.THISMONTH:
      return [
        `${key}_gt_${moment
          .utc()
          .startOf("month")
          .format("YYYY-MM-DD")}`
      ];
    case TIMESPANS.LASTMONTH:
      const lastmonth = moment
        .utc()
        .startOf("month")
        .subtract(1, "days");
      return [
        `${key}_gt_${lastmonth.startOf("month").format("YYYY-MM-DD")}`,
        `${key}_lt_${lastmonth.endOf("month").format("YYYY-MM-DD")}`
      ];
    case TIMESPANS.THISYEAR:
      return [
        `${key}_gt_${moment
          .utc()
          .startOf("year")
          .format("YYYY-MM-DD")}`
      ];
    case TIMESPANS.LASTYEAR:
      const lastyear = moment
        .utc()
        .startOf("year")
        .subtract(1, "days");
      return [
        `${key}_gt_${lastyear.startOf("year").format("YYYY-MM-DD")}`,
        `${key}_lt_${lastyear.endOf("year").format("YYYY-MM-DD")}`
      ];
  }

  return [
    `${key}_gt_${moment
      .utc()
      .startOf("week")
      .format("YYYY-MM-DD")}`
  ];
}

function constructJobsQuery(state) {
  const filter = [];
  const accountId = state.profile.user.data.account;
  filter.push(`account_id_eq_${accountId}`);

  const spanFilters = spanToDateFilters(
    "created",
    state.downloader.jobQueryParams.span
  );
  filter.push(...spanFilters);

  const limit = null;

  const fields = [
    "title",
    "submittedBy",
    "jid",
    "project",
    "created",
    "id",
    "location",
    "output_path",
    "user"
  ];

  // console.log;

  const esc = encodeURIComponent;
  const flat = {};
  if (filter) flat.filter = filter.join(",");
  if (fields) flat.fields = fields.join(",");
  if (limit) flat.limit = limit;

  if (Object.keys(flat).length) {
    // return Object.keys(flat)
    //   .map(k => `${esc(k)}=${esc(flat[k])}`)
    //   .join("&");

    return Object.keys(flat)
      .map(k => `${k}=${flat[k]}`)
      .join("&");
  }
  return "";
}

/* 
A thunk that wraps getRecentJobs(). 
1. dispatch(requestJobs()); - maybe start a spinner
2. call getRecentJobs
3. dispatch(receiveJobs(data)); - add data to store, kill the spinner etc.
*/
export function fetchJobs(params) {
  return async function(dispatch, getState) {
    dispatch(requestJobs());
    const state = getState();
    try {
      if (!state.profile.user.data) {
        throw Error("Not logged in");
      }

      const queryString = constructJobsQuery(state);
      const data = await getRecentJobs(state);
      dispatch(receiveJobs(data));
    } catch (error) {
      dispatch(receiveJobs({}));
      dispatch(
        setNotification({
          type: "error",
          snackbar: error.message
        })
      );
    }
  };
}

// function spanToDateFilters(key, span)
// {

// }
// if (span) {
//   filter.push(...spanToDateFilters("created", span))
// }

/* 
Function to do two fetches, one after the other.
First fetch the summary list and work out the id of the `partition` record.
Now the second fetch gets the jobs created after that partition job
*/
async function getRecentJobs(state) {
  // options is just headers, content type etc.

  const options = createRequestOptions(state);

  // const accountId = state.profile.user.data.account;
  // const
  const queryString = constructJobsQuery(state);

  const { dashboardUrl } = state.environment.project;

  //dashboard.conductortech.com/api/v1/jobs?filter=created_gt_2019-01-26,created_lt_2019-02-02,account_id_eq_5669544198668288
  const url = `${dashboardUrl}/api/v1/jobs?${queryString}`;

  console.log(url);
  console.log(options);

  // const url = `${dashboardUrl}/api/v1/jobs?filter=created_gt_2019-01-26,created_lt_2019-02-02,account_id_eq_${accountId}`;
  // console.log(url);
  // console.log(options);

  const response = await fetch(url, options);
  checkResponse(response);

  const data = await response.json();
  return data;
}

export function fetchDownloadSummary(jobLabel) {
  return async function(dispatch, getState) {
    try {
      await dispatch(getDownloadFiles(jobLabel));

      dispatch(requestExistingFilesInfo(jobLabel));

      // Timeout(0) because otherwise redux will batch the
      // actions before updating the component, meaning we don't
      // get to see anything until after updateExistingFilesInfo
      // completes.
      setTimeout(function() {
        dispatch(updateExistingFilesInfo(jobLabel));
      }, 0);
    } catch (error) {
      dispatch(
        setNotification({
          type: "info",
          snackbar: "Can't fetch download data for this job."
        })
      );
      dispatch(
        receiveDownloadSummary({
          jobLabel
        })
      );
    }
  };
}

export function getDownloadFiles(jobLabel) {
  return async function(dispatch, getState) {
    const state = getState();
    dispatch(requestDownloadData(jobLabel));

    const options = createRequestOptions(state);
    const { projectUrl } = state.environment.project;
    const url = `${projectUrl}/downloads/${jobLabel}`;
    let response = await fetch(url, options);

    checkResponse(response);

    let data = await response.json();

    let outputDirectory = null;
    let first = true;
    const files = {};

    const downloads = data.downloads || [];

    downloads.forEach(task => {
      return task.files.forEach(file => {
        if (first) {
          outputDirectory = file["output_dir"];
          first = false;
        }
        const rp = file["relative_path"];

        files[rp] = {
          relativePath: rp,
          md5: file["md5"]
        };
      });
    });

    dispatch(receiveDownloadSummary({ files, jobLabel, outputDirectory }));
  };
}

export function updateExistingFilesInfo(jobLabel) {
  return async function(dispatch, getState) {
    const state = getState();
    dispatch(requestExistingFilesInfo(jobLabel));
    const job = state.entities.jobs[jobLabel];

    const existing = [];

    const { outputDirectory, files } = job;

    if (directoryExistsSync(outputDirectory) && files) {
      Object.values(files).forEach(f => {
        const fullPath = path.join(outputDirectory, f.relativePath);
        const md5 = f.md5;
        if (exactFileExistsSync(fullPath, md5)) {
          existing.push(f.relativePath);
        }
      });
    }

    dispatch(receiveExistingFilesInfo({ jobLabel, existing }));
  };
}

export function viewOputputDirectoryInFinder(jobLabel) {
  return async function(dispatch, getState) {
    const state = getState();
    const { outputDirectory } = state.entities.jobs[jobLabel];
    open(outputDirectory);
  };
}
