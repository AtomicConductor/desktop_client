import { createReducer } from "@reduxjs/toolkit";
import { setPythonLocation } from "../_actions/settings/pythonLocation";
import { setPackageLocation } from "../_actions/settings/packageLocation";

const PYTHON_VERSION = "2.7.18";
const initialState = {
  pythonLocation: "",
  packageLocation: "",
  pythonLocationValid: true,
  pythonInstallerVersion: PYTHON_VERSION,
  pythonInstallers: [
    {
      label: "MacOS 64-bit",
      url: `https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}-macosx10.9.pkg`,
      description: "For Mac OS X 10.9 and later",
      os: "darwin",
      default: true
    },
    {
      label: "Windows x86-64 MSI",
      url: `https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}.amd64.msi`,
      description: "For Windows 64 bits",
      os: "win32",
      default: true
    },
    {
      label: "Windows x86 MSI",
      url: `https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}.msi`,
      description: "For Windows 32 bits",
      os: "win32",
      default: false
    }
  ]
};

export default createReducer(initialState, {
  [setPythonLocation]: (state, action) => {
    const { location, valid } = action.payload;
    state.pythonLocation = location;
    state.pythonLocationValid = valid;
  },
  [setPackageLocation]: (state, { payload }) => {
    state.packageLocation = payload;
  }
});
