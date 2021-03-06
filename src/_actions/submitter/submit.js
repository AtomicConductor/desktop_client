import { createAction } from "@reduxjs/toolkit";
import desktopClientErrorHandler from "../../middleware/desktopClientErrorHandler";
import { runPythonShell } from "../../_helpers/python";
import { pushEvent } from "../../_actions/log";
import {
  submissionSelector,
  jobTitleSelector,
  submissionValidSelector,
  assetsMap
} from "../../_selectors/submitter";

import { pythonLocation, packageLocation } from "../../_selectors/settings";

import { setNotification } from "../notification";
import DesktopClientError from "../../errors/desktopClientError";
import config from "../../config";
import { pathExists } from "../../_helpers/fileSystem";

const submissionRequested = createAction("submitter/submissionRequested");
const submissionFinished = createAction("submitter/submissionFinished");
const validationRequested = createAction("submitter/validationRequested");
const validationFinished = createAction("submitter/validationFinished");
const clearValidationResult = createAction("submitter/clearValidationResult");

const submitWithValidation = () => async (dispatch, getState) => {
  dispatch(validationRequested());
  const state = getState();
  const { errors: validationErrors, alerts } = submissionValidSelector(state);
  const errors = [...validationErrors];

  const missingAssets = [];
  for (const path in assetsMap(state)) {
    if (!(await pathExists(path))) missingAssets.push(path);
  }

  if (missingAssets.length) {
    errors.push(
      "Some assets no longer exist on disk, please remove them from the files tab."
    );
  }

  dispatch(validationFinished({ errors, alerts, missingAssets }));

  if (errors.length || alerts.length) {
    return;
  }

  dispatch(submit());
};

const submit = (
  pythonShell = runPythonShell,
  errorHandler = desktopClientErrorHandler
) => async (dispatch, getState) => {
  const state = getState();

  const pythonPath = pythonLocation(state);
  const args = [
    JSON.stringify(submissionSelector(state)),
    packageLocation(state)
  ].filter(_ => _);

  const title = jobTitleSelector(state);

  const env = {
    CONDUCTOR_AUTH_URL: config.dashboardUrl,
    CONDUCTOR_PROJECT_URL: config.projectUrl
  };

  const pyshell = await pythonShell("submit.py", { env, pythonPath, args });

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

export {
  submissionRequested,
  submissionFinished,
  submitWithValidation,
  submit,
  validationRequested,
  validationFinished,
  clearValidationResult
};
