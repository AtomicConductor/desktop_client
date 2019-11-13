import { createAction } from "redux-starter-kit";
import { createRequestOptions } from "../_helpers/network";
import moment from "moment";
import { TIMESPANS } from "../_helpers/constants";
import config from "../config";
import { currentAccountSelector, tokenSelector } from "../selectors/account";
import axios from "../_helpers/axios";

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
      return [];
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
  const { id: accountId } = currentAccountSelector(state);
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

export const fetchJobs = () => {
  return async function(dispatch, getState) {
    dispatch(requestJobs());
    const state = getState();
    const options = createRequestOptions(tokenSelector(state));
    const queryString = constructJobsQuery(state);
    const { dashboardUrl } = config;

    const url = `${dashboardUrl}/api/v1/jobs?${queryString}`;
    const response = await axios.get(url, options);
    const { data } = response;

    dispatch(receiveJobs(data));
  };
};
