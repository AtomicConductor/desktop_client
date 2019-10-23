import { PythonShell } from "python-shell";
import { createAction } from "redux-starter-kit";
import * as axios from "axios";
import config from "../config";
import SubmitterError from "../errors/submitterError";
import { tokenSelector } from "../selectors/account";
import { createRequestOptions } from "../_helpers/network";

const setJobTitle = createAction("submitter/setJobTitle");
const setFrameSpec = createAction("submitter/setFrameSpec");
const setChunkSize = createAction("submitter/setChunkSize");
const setTileSpec = createAction("submitter/setTileSpec");
const setScoutFrameSpec = createAction("submitter/setScoutFrameSpec");
const setUseTiles = createAction("submitter/setUseTiles");
const setUseScoutFrames = createAction("submitter/setUseScoutFrames");
const setTaskTemplate = createAction("submitter/setTaskTemplate");
const setPreemptible = createAction("submitter/setPreemptible");
const setRetries = createAction("submitter/setRetries");
const setInstanceTypeIndex = createAction("submitter/setInstanceTypeIndex");
const setProjectIndex = createAction("submitter/setProjectIndex");
const projectsSuccess = createAction("submitter/projectsSuccess");
const projectsError = createAction("submitter/projectsError");
const instanceTypesSuccess = createAction("submitter/instanceTypesSuccess");
const instanceTypesError = createAction("submitter/instanceTypesError");

const addAssets = createAction("submitter/addAssets");
const removeAssets = createAction("submitter/removeAssets");

const updateAssetSelection = createAction("submitter/updateAssetSelection");

const submission = require("../components/submitter/preview/tmp.json");

/**
 * Temporary code - for testing Python shell submission only.
 */
const testPythonShell = () => {
  return (dispatch, getState) => {
    let options = {
      mode: "text",
      pythonPath: "/Users/julian/.virtualenvs/ccc/bin/python",
      pythonOptions: ["-u"],
      scriptPath: "/Users/julian/dev/cnw/src/python/",
      args: [submission]
    };

    PythonShell.run("submit.py", options, function(err, results) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("results:", results);
    });
  };
};

const fetchProjects = () => async (dispatch, getState) => {
  try {
    const options = createRequestOptions(tokenSelector(getState()));
    const response = await axios.get(
      `${config.apiServer}/api/v1/projects`,
      options
    );
    const projects = response.data.data
      .filter(_ => _.status === "active")
      .sort((a, b) => a.name < b.name)
      .map(_ => _.name);

    if (!projects) throw new Error("Failed to fetch any active projects");

    dispatch(projectsSuccess(projects));
  } catch (e) {
    dispatch(projectsError(e.response.status));
    throw new SubmitterError(e);
  }
};

const fetchInstanceTypes = () => async (dispatch, getState) => {
  try {
    const options = createRequestOptions(tokenSelector(getState()));
    const response = await axios.get(
      `${config.dashboardUrl}/api/v1/instance-types`,
      options
    );
    const instanceTypes = response.data.data;
    if (!instanceTypes) throw new Error("Failed to fetch any instance types");
    dispatch(instanceTypesSuccess(instanceTypes));
  } catch (e) {
    dispatch(instanceTypesError(e.response.status));
    throw new SubmitterError(e);
  }
};

export {
  fetchProjects,
  fetchInstanceTypes,
  testPythonShell,
  setJobTitle,
  setFrameSpec,
  setChunkSize,
  setTileSpec,
  setScoutFrameSpec,
  setUseTiles,
  setUseScoutFrames,
  setTaskTemplate,
  setPreemptible,
  setRetries,
  setInstanceTypeIndex,
  setProjectIndex,
  projectsSuccess,
  instanceTypesSuccess,
  projectsError,
  instanceTypesError,
  addAssets,
  removeAssets,
  updateAssetSelection
};
