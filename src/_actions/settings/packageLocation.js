import { settings as kSettings } from "../../_helpers/constants";
import { createAction } from "@reduxjs/toolkit";
import os from "os";
import path from "upath";
import { getInstalledInfo } from "../plugins/install";

const DEFAULT_INSTALL_DIR = path.join(os.homedir(), "Conductor");
const setPackageLocation = createAction("settings/setPackageLocation");

const savePackageLocation = location => dispatch => {
  location = location || "";
  localStorage.setItem(kSettings.packageLocation, location);
  dispatch(setPackageLocation(location));
  dispatch(getInstalledInfo());
};

const loadPackageLocation = (
  default_location = DEFAULT_INSTALL_DIR
) => dispatch => {
  const location =
    localStorage.getItem(kSettings.packageLocation) || default_location;
  dispatch(setPackageLocation(location));
  dispatch(getInstalledInfo());
};

const resetPackageLocation = (
  default_location = DEFAULT_INSTALL_DIR
) => dispatch => {
  dispatch(savePackageLocation(default_location));
};

export {
  loadPackageLocation,
  savePackageLocation,
  resetPackageLocation,
  setPackageLocation
};
