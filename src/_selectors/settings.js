import os from "os";
const PLATFORM = os.platform();
const pythonLocation = state => state.settings.pythonLocation.trim();
const pythonLocationValid = state => state.settings.pythonLocationValid;

const packageLocation = state => state.settings.packageLocation.trim();

const pythonInstallersSelector = state =>
  state.settings.pythonInstallers.filter(el => el.os === PLATFORM) || [];

export {
  pythonLocation,
  packageLocation,
  pythonLocationValid,
  pythonInstallersSelector
};
