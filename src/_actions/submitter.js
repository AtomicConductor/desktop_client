import { createAction } from "@reduxjs/toolkit";
import axios from "../_helpers/axios";
import config from "../config";
import DesktopClientError from "../errors/desktopClientError";

import { tokenSelector } from "../selectors/account";
import { pushEvent } from "../_actions/log";
import { createRequestOptions } from "../_helpers/network";
import {
  submissionSelector,
  pythonLocation,
  jobTitleSelector,
  instanceTypeSelector,
  projectSelector
} from "../selectors/submitter";

import { signedInSelector, currentAccountSelector } from "../selectors/account";

import { setNotification } from "./notification";
import AppStorage from "../_helpers/storage";
import { instanceTypesMapSelector } from "../selectors/entities";
import {
  resolvePythonLocation,
  runPythonShell,
  isPythonPathValid
} from "../_helpers/python";
import { settings } from "../_helpers/constants";
import desktopClientErrorHandler from "../middleware/desktopClientErrorHandler";

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

const submit = (
  pythonShell = runPythonShell,
  errorHandler = desktopClientErrorHandler
) => async (dispatch, getState) => {
  const state = getState();

  const pythonPath = pythonLocation(state);
  const args = [JSON.stringify(submissionSelector(state))];
  const title = jobTitleSelector(state);

  const pyshell = await pythonShell("submit.py", { pythonPath, args });

  dispatch(submissionRequested());

  pyshell.on("message", message => {
    dispatch(pushEvent(message, "info"));

    if (!message.match(/response_code/)) {
      return;
    }

    const response = JSON.parse(message);
    if (response.response_code === 201) {
      const notificationMessage = `Successfully submitted job '${title}' to Conductor.`;
      dispatch(
        setNotification({
          message: notificationMessage,
          type: "success",
          url: `${config.dashboardUrl}${response.uri.replace("/jobs", "/job")}`,
          buttonLabel: "view"
        })
      );
      dispatch(pushEvent(notificationMessage, "info"));
      return;
    }

    const error = `Submission failed with response code ${response.response_code}`;
    dispatch(submissionFinished());
    dispatch(errorHandler(new DesktopClientError(error)));
  });

  pyshell.on("stderr", message => {
    dispatch(pushEvent(message, "error"));
  });

  pyshell.on("close", () => {
    dispatch(submissionFinished());
  });

  pyshell.on("error", message => {
    dispatch(errorHandler(new DesktopClientError(message)));
  });
};

const fetchProjects = () => async (dispatch, getState) => {
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
  dispatch(setInstanceType(instanceTypeSelector(getState())));
};

//TODO: remove all mapping code into a normalizer
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
  const response = await axios.get(`${config.dashboardUrl}/api/v1/ee/packages`);

  const {
    data: { data }
  } = response;

  const packages = mapPackages(data);
  dispatch(softwarePackagesSuccess(packages));
};

const saveSubmission = path => async (dispatch, getState) => {
  const storage = new AppStorage();
  await storage.save(path, getState().submitter.submission);
  dispatch(saveSubmissionSuccess(path));
  dispatch(
    setNotification({
      message: `Successfully saved ${path}`,
      type: "success"
    })
  );
};

const loadSubmission = path => async (dispatch, getState) => {
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
};

//TODO: investigate other options
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

const savePythonLocation = (
  path,
  pythonPathValidator = isPythonPathValid
) => async dispatch => {
  const isValid = await pythonPathValidator(path);
  if (!isValid) {
    throw new DesktopClientError(
      "Invalid python 2.7 location. Please browse your computer for a valid Python 2.7. Install it if necessary."
    );
  }

  localStorage.setItem(settings.pythonLocation, path);
  dispatch(setPythonLocation(path));
};

const loadPythonLocation = (
  pythonPathResolver = resolvePythonLocation,
  pythonPathValidator = isPythonPathValid
) => async dispatch => {
  let path = localStorage.getItem(settings.pythonLocation);
  if (!path) {
    path = await pythonPathResolver();
    dispatch(savePythonLocation(path, pythonPathValidator));
  } else {
    dispatch(setPythonLocation(path));
  }
};

const resetPythonLocation = (
  pythonPathResolver = resolvePythonLocation,
  pythonPathValidator = isPythonPathValid
) => async dispatch => {
  const path = await pythonPathResolver();
  dispatch(savePythonLocation(path, pythonPathValidator));
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
  applyResetSubmission,
  setEnvEntry,
  setPythonLocation,
  savePythonLocation,
  loadPythonLocation,
  resetPythonLocation,
  submit,
  insertTaskTemplateToken,
  submissionRequested,
  submissionFinished,
  setSubmissionResponse
};
