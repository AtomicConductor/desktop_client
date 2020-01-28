import {
  signedInSelector,
  currentAccountSelector
} from "../../selectors/account";
import { createRequestOptions } from "../../_helpers/network";
import { tokenSelector } from "../../selectors/account";
import axios from "../../_helpers/axios";
import config from "../../config";
import DesktopClientError from "../../errors/desktopClientError";
import { projectSelector } from "../../selectors/submitter";
import { createAction } from "@reduxjs/toolkit";

const projectsSuccess = createAction("submitter/projectsSuccess");
const setProject = createAction("submitter/setProject");

export { projectsSuccess, setProject };

export default () => async (dispatch, getState) => {
  const state = getState();
  const options = createRequestOptions(tokenSelector(state));
  //TODO: accountFilterQuery -> accountFilterQuerySelector
  const accountFilterQuery = signedInSelector(state)
    ? `filter=account_id_eq_${currentAccountSelector(state).id}`
    : "";

  const response = await axios.get(
    `${config.projectUrl}/api/v1/projects?${accountFilterQuery}`,
    options
  );

  //TODO: refactor into a normalizer
  const projects = response.data.data
    .filter(_ => _.status === "active")
    .map(_ => _.name);

  if (!projects)
    throw new DesktopClientError("Failed to fetch any active projects");

  dispatch(projectsSuccess(projects));
  dispatch(setProject(projectSelector(getState())));
};
