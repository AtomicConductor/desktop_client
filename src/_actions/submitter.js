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
const softwarePackagesSuccess = createAction(
  "submitter/softwarePackagesSuccess"
);
const updateSelectedSoftware = createAction("submitter/updateSelectedSoftware");

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

const mapPackages = software => {
  const softwarePackagesProjection = ({
    product,
    major_version,
    minor_version,
    release_version,
    build_version,
    package_id: id,
    plugin_host_product: host,
    plugin_host_version: hostVersion,
    environment
  }) => {
    const major = major_version || 0;
    const minor = minor_version || 0;
    const release = release_version || 0;
    const formattedHost =
      (host && hostVersion && ` (${host} ${hostVersion})`) || "";
    const build = (build_version && `-${build_version}`) || "";
    return {
      product,
      package: {
        id,
        version: `${major}.${minor}.${release}${build}${formattedHost}`,
        environment
      }
    };
  };

  const byProductAscending = (a, b) =>
    a.product === b.product ? 0 : a.product < b.product ? -1 : 1;

  const toProductPackagesMap = (software, { product, package: pkg }) => {
    software[product] = software[product] || { packages: [] };
    software[product].packages.push(pkg);
    return software;
  };

  const byVersionDescending = (a, b) =>
    a.version === b.version ? 0 : a.version > b.version ? -1 : 1;

  const exclusions = ({ product }) => !["houdini"].includes(product);

  const mappedPackages = software
    .map(softwarePackagesProjection)
    .filter(exclusions)
    .sort(byProductAscending)
    .reduce(toProductPackagesMap, {});

  Object.values(mappedPackages).forEach(({ packages }) => {
    packages.sort(byVersionDescending);
  });

  return mappedPackages;
};

const fetchSoftwarePackages = () => async dispatch => {
  try {
    const response = await axios.get(
      `${config.dashboardUrl}/api/v1/ee/packages`
    );

    const {
      data: { data }
    } = response;

    const packages = mapPackages(data);
    dispatch(softwarePackagesSuccess(packages));
  } catch (e) {
    console.log(e);
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
  updateAssetSelection,
  fetchSoftwarePackages,
  softwarePackagesSuccess,
  updateSelectedSoftware
};
