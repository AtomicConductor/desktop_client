import DesktopClientError from "../../errors/desktopClientError";
import {
  resolvePythonLocation,
  isPythonPathValid
} from "../../_helpers/python";
import { settings } from "../../_helpers/constants";
import { createAction } from "@reduxjs/toolkit";
import { exec } from "child_process";

const setPythonLocation = createAction("submitter/setPythonLocation");

const savePythonLocation = (
  path,
  pythonPathValidator = isPythonPathValid
) => async dispatch => {
  const isValid = await pythonPathValidator(path, exec);
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
  loadPythonLocation,
  savePythonLocation,
  resetPythonLocation,
  setPythonLocation
};
