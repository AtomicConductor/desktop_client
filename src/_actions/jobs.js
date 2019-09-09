import { createAction } from "redux-starter-kit";
import { setNotification } from "./notification";
import { createRequestOptions } from "../_helpers/network";
import open from "open";
import moment from "moment";
import { checkResponse } from "../_helpers/network";
import { TIMESPANS } from "../_helpers/constants";
import config from "../config";
import { deleteSession } from "./profile";

export const requestJobs = createAction("downloader/requestJobs");
export const receiveJobs = createAction("downloader/receiveJobs");
export const setOutputPathValue = createAction("downloader/setOutputPathValue");
export const resetOutputPathValue = createAction(
  "downloader/resetOutputPathValue"
);
export const setJobQuery = createAction("downloader/setJobQuery");

const FMT = "YYYY-MM-DD";
/**
 * Generates string to filter by date in a query, for example "created_gt_2019-06-23"
 *
 * @param {string} key
 * @param {*} span
 * @returns {string}
 */
function spanToDateFilters(key, span) {
  switch (span) {
    case TIMESPANS.TODAY:
      return [`${key}_gt_${moment.utc().format(FMT)}`];
    case TIMESPANS.THISWEEK:
      return [
        `${key}_gt_${moment
          .utc()
          .startOf("week")
          .format(FMT)}`
      ];
    case TIMESPANS.LASTWEEK:
      const lastweek = moment.utc().subtract(7, "days");
      return [
        `${key}_gt_${lastweek.startOf("week").format(FMT)}`,
        `${key}_lt_${lastweek.endOf("week").format(FMT)}`
      ];
    case TIMESPANS.THISMONTH:
      return [
        `${key}_gt_${moment
          .utc()
          .startOf("month")
          .format(FMT)}`
      ];
    case TIMESPANS.LASTMONTH:
      const lastmonth = moment
        .utc()
        .startOf("month")
        .subtract(1, "days");
      return [
        `${key}_gt_${lastmonth.startOf("month").format(FMT)}`,
        `${key}_lt_${lastmonth.endOf("month").format(FMT)}`
      ];
    case TIMESPANS.THISYEAR:
      return [
        `${key}_gt_${moment
          .utc()
          .startOf("year")
          .format(FMT)}`
      ];
    case TIMESPANS.LASTYEAR:
      const lastyear = moment
        .utc()
        .startOf("year")
        .subtract(1, "days");
      return [
        `${key}_gt_${lastyear.startOf("year").format(FMT)}`,
        `${key}_lt_${lastyear.endOf("year").format(FMT)}`
      ];
    default:
      return [
        `${key}_gt_${moment
          .utc()
          .startOf("month")
          .format(FMT)}`
      ];
  }
}

/**
 * Constructs a query to fetch some jobs in a time range.
 *
 * @param {redux} state
 * @returns {string} Query string with filters, fields and limit.
 */
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

  const flat = {};
  if (filter) flat.filter = filter.join(",");
  if (fields) flat.fields = fields.join(",");
  if (limit) flat.limit = limit;

  if (Object.keys(flat).length) {
    return Object.keys(flat)
      .map(k => `${k}=${flat[k]}`)
      .join("&");
  }
  return "";
}

/**
 * Thunk to fetch some jobs while a loading indicator is displayed.
 * requestJobs() is dispatched first, to start a spinner.
 * Then we try to get the recent jobs based on the state.
 * Finally dispatch receiveJobs() to update the store and hide the spinner.
 *
 * @export
 * @returns
 */
export function fetchJobs() {
  return async function(dispatch, getState) {
    dispatch(requestJobs());
    const state = getState();
    try {
      if (!state.profile.user.data) {
        throw Error("Not logged in");
      }

      const data = await getRecentJobs(state);
      dispatch(receiveJobs(data));
    } catch (error) {
      dispatch(receiveJobs({}));

      if (error.message === "Unauthorized") {
        console.log("DELETING SESSION");
        dispatch(deleteSession());
      }
      dispatch(
        setNotification({
          type: "error",
          snackbar: error.message
        })
      );
    }
  };
}

/**
 * Fetches some jobs.
 *
 * @param {redux} state
 * @returns Array of jobs.
 */
async function getRecentJobs(state) {
  const options = createRequestOptions(state);

  const queryString = constructJobsQuery(state);

  const { dashboardUrl } = config;

  const url = `${dashboardUrl}/api/v1/jobs?${queryString}`;

  const response = await fetch(url, options);
  checkResponse(response);

  const data = await response.json();
  return data;
}

/**
 * Opens the outputDoirectory using the OS, for exqample the finder on Mac.
 *
 * @export
 * @param {string} jobLabel
 * @returns
 */
export function viewOputputDirectoryInFinder(jobLabel) {
  return async function(dispatch, getState) {
    const state = getState();
    const { outputDirectory } = state.entities.jobs[jobLabel];
    open(outputDirectory);
  };
}
