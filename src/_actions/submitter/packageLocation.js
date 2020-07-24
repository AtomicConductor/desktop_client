import { settings } from "../../_helpers/constants";
import { createAction } from "@reduxjs/toolkit";

const setPackageLocation = createAction("submitter/setPackageLocation");

const savePackageLocation = location => dispatch => {
  location = location || "";
  localStorage.setItem(settings.packageLocation, location);
  dispatch(setPackageLocation(location));
};

const loadPackageLocation = () => dispatch => {
  const location = localStorage.getItem(settings.packageLocation) || "";
  dispatch(setPackageLocation(location));
};

const resetPackageLocation = () => dispatch => {
  dispatch(savePackageLocation(null));
};

export {
  loadPackageLocation,
  savePackageLocation,
  resetPackageLocation,
  setPackageLocation
};
