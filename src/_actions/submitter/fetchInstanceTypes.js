import { tokenSelector } from "../../selectors/account";
import { createRequestOptions } from "../../_helpers/network";
import { instanceTypeSelector } from "../../selectors/submitter";
import axios from "../../_helpers/axios";
import config from "../../config";
import DesktopClientError from "../../errors/desktopClientError";
import { createAction } from "@reduxjs/toolkit";

const instanceTypesSuccess = createAction("submitter/instanceTypesSuccess");
const setInstanceType = createAction("submitter/setInstanceType");

export { instanceTypesSuccess, setInstanceType };

export default () => async (dispatch, getState) => {
  const options = createRequestOptions(tokenSelector(getState()));
  const response = await axios.get(
    `${config.dashboardUrl}/api/v1/instance-types`,
    options
  );
  const instanceTypes = response.data.data;

  if (!instanceTypes)
    throw new DesktopClientError("Failed to fetch any instance types");

  dispatch(instanceTypesSuccess(instanceTypes));
  dispatch(setInstanceType(instanceTypeSelector(getState())));
};
