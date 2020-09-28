import {
  resolvePythonLocation,
  isPythonPathValid
} from "../../_helpers/python";
import { settings as kSettings } from "../../_helpers/constants";
import { createAction } from "@reduxjs/toolkit";

const setPythonLocation = createAction("settings/setPythonLocation");

const validSetPythonLocation = (
  location,
  validator = isPythonPathValid
) => async dispatch => {
  const valid = await validator(location);
  dispatch(setPythonLocation({ location, valid }));
};

const savePythonLocation = location => dispatch => {
  location = location || "";
  localStorage.setItem(kSettings.pythonLocation, location);
  dispatch(validSetPythonLocation(location));
};

const loadPythonLocation = (
  pythonPathResolver = resolvePythonLocation
) => async dispatch => {
  let path = localStorage.getItem(kSettings.pythonLocation);
  if (!path) {
    path = await pythonPathResolver();
    dispatch(savePythonLocation(path));
  } else {
    dispatch(validSetPythonLocation(path));
  }
};

const resetPythonLocation = (
  pythonPathResolver = resolvePythonLocation
) => async dispatch => {
  const path = await pythonPathResolver();
  dispatch(savePythonLocation(path));
};

export {
  loadPythonLocation,
  savePythonLocation,
  resetPythonLocation,
  setPythonLocation,
  validSetPythonLocation
};
