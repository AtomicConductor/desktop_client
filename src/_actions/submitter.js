import { createAction } from "redux-starter-kit";
import axios from "../_helpers/axios";
import config from "../config";
import SubmitterError from "../errors/submitterError";
import DesktopClientError from "../errors/desktopClientError";
import FileIOError from "../errors/fileIOError";

import { tokenSelector } from "../selectors/account";
import { pushEvent } from "../_actions/log";
import { createRequestOptions } from "../_helpers/network";
import {
  submissionSelector,
  submissionValidSelector,
  pythonLocation,
  jobTitleSelector
} from "../selectors/submitter";

import { setNotification } from "./notification";
import AppStorage from "../_helpers/storage";
import { instanceTypesMapSelector } from "../selectors/entities";
import { resolvePythonLocation, runPythonShell } from "../_helpers/python";
import { settings } from "../_helpers/constants";

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
const setInstanceType = createAction("submitter/setInstanceType");
const setProject = createAction("submitter/setProject");
const setOutputPath = createAction("submitter/setOutputPath");

const projectsSuccess = createAction("submitter/projectsSuccess");
const instanceTypesSuccess = createAction("submitter/instanceTypesSuccess");

const addAssets = createAction("submitter/addAssets");
const removeAssets = createAction("submitter/removeAssets");

const saveSubmissionSuccess = createAction("submitter/saveSubmissionSuccess");
const loadSubmissionSuccess = createAction("submitter/loadSubmissionSuccess");
const applyResetSubmission = createAction("submitter/applyResetSubmission");

const softwarePackagesSuccess = createAction(
  "submitter/softwarePackagesSuccess"
);
const updateSelectedSoftware = createAction("submitter/updateSelectedSoftware");

const setEnvEntry = createAction("submitter/setEnvEntry");
const setPythonLocation = createAction("submitter/setPythonLocation");

const submissionRequested = createAction("submitter/submissionRequested");
const setSubmissionResponse = createAction("submitter/setSubmissionResponse");
const submissionFinished = createAction("submitter/submissionFinished");

const submit = () => async (dispatch, getState) => {
  if (!submissionValidSelector(getState())) {
    throw new DesktopClientError(
      "Invalid submission. Please check the preview tab for errors."
    );
  }

  const pythonPath = pythonLocation(getState());
  const args = [JSON.stringify(submissionSelector(getState()))];

  const pyshell = await runPythonShell("submit.py", { pythonPath, args });
  dispatch(submissionRequested());

  pyshell.on("message", function(message) {
    if (message.match(/response_code/)) {
      const response = JSON.parse(message);
      const title = jobTitleSelector(getState());
      if (response.response_code === 201) {
        dispatch(
          setNotification({
            message: `Successfully submitted ${title}`,
            type: "success",
            url: `${config.dashboardUrl}${response.uri.replace(
              "/jobs",
              "/job"
            )}`,
            buttonLabel: "view"
          })
        );
        dispatch(pushEvent(message, "info"));
      } else {
        dispatch(
          setNotification({
            message: `Submission failed with response code ${
              response.response_code
            }`,
            type: "error"
          })
        );
        dispatch(pushEvent(message, "error"));
      }
    } else {
      dispatch(pushEvent(message, "info"));
    }
  });

  pyshell.on("stderr", function(message) {
    dispatch(pushEvent(message, "error"));
  });

  pyshell.end(function(error, code, signal) {
    dispatch(submissionFinished());
    if (error) {
      dispatch(setNotification({ message: error.message, type: "error" }));
      return;
    }
  });
};

const fetchProjects = () => async (dispatch, getState) => {
  const options = createRequestOptions(tokenSelector(getState()));
  const response = await axios.get(
    `${config.apiServer}/api/v1/projects`,
    options
  );
  const projects = response.data.data
    .filter(_ => _.status === "active")
    .map(_ => _.name);

  if (!projects)
    throw new DesktopClientError("Failed to fetch any active projects");

  dispatch(projectsSuccess(projects));
};

const fetchInstanceTypes = () => async (dispatch, getState) => {
  const options = createRequestOptions(tokenSelector(getState()));
  const response = await axios.get(
    `${config.dashboardUrl}/api/v1/instance-types`,
    options
  );
  const instanceTypes = response.data.data;

  if (!instanceTypes)
    throw new DesktopClientError("Failed to fetch any instance types");
  dispatch(instanceTypesSuccess(instanceTypes));
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
    throw new SubmitterError(e);
  }
};

const saveSubmission = path => async (dispatch, getState) => {
  try {
    const storage = new AppStorage();
    await storage.save(path, getState().submitter.submission);
    dispatch(saveSubmissionSuccess(path));
    dispatch(
      setNotification({
        message: `Successfully saved ${path}`,
        type: "success"
      })
    );
  } catch (e) {
    throw new FileIOError(e);
  }
};

const loadSubmission = path => async (dispatch, getState) => {
  try {
    const storage = new AppStorage();
    const submission = await storage.load(path);

    dispatch(loadSubmissionSuccess({ path, submission }));
    dispatch(syncStateWithLoadedSubmission(submission));

    dispatch(
      setNotification({
        message: `Successfully opened ${path}`,
        type: "success"
      })
    );
  } catch (e) {
    throw new FileIOError(e);
  }
};

const resetSubmission = () => (dispatch, getState) => {
  try {
    dispatch(applyResetSubmission());
  } catch (e) {
    throw new SubmitterError(e);
  }
};

const syncStateWithLoadedSubmission = submission => async (
  dispatch,
  getState
) => {
  const state = getState();
  dispatch(
    setInstanceType(
      instanceTypesMapSelector(state)[submission.instanceType.name]
    )
  );

  const { softwarePackages } = state.entities;
  submission.softwarePackages.forEach(
    ({ softwareKey, package: { id } }, index) => {
      if (!softwarePackages[softwareKey]) return;
      const pkg = softwarePackages[softwareKey].packages.find(_ => _.id === id);
      dispatch(updateSelectedSoftware({ index, softwareKey, package: pkg }));
    }
  );
};

const insertTaskTemplateToken = payload => async (dispatch, getState) => {
  const { token, start, end } = payload;
  const { taskTemplate } = getState().submitter.submission;

  const prefix = taskTemplate.substring(0, start);
  const postfix = taskTemplate.substring(end);
  const updatedTemplate = `${prefix}<${token}>${postfix}`;

  dispatch(setTaskTemplate(updatedTemplate));
};

const savePythonLocation = path => async dispatch => {
  localStorage.setItem(settings.pythonLocation, path);
  dispatch(setPythonLocation(path));
};

const loadPythonLocation = (
  pythonPathResolver = resolvePythonLocation
) => async dispatch => {
  let path = localStorage.getItem(settings.pythonLocation);
  if (!path) {
    path = await pythonPathResolver();
    dispatch(savePythonLocation(path));
  } else {
    dispatch(setPythonLocation(path));
  }
};

export {
  fetchProjects,
  fetchInstanceTypes,
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
  setInstanceType,
  setProject,
  setOutputPath,
  projectsSuccess,
  instanceTypesSuccess,
  addAssets,
  removeAssets,
  fetchSoftwarePackages,
  softwarePackagesSuccess,
  updateSelectedSoftware,
  saveSubmission,
  saveSubmissionSuccess,
  loadSubmission,
  loadSubmissionSuccess,
  resetSubmission,
  applyResetSubmission,
  setEnvEntry,
  setPythonLocation,
  savePythonLocation,
  loadPythonLocation,
  submit,
  insertTaskTemplateToken,
  submissionRequested,
  submissionFinished,
  setSubmissionResponse
};
