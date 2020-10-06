import { createAction } from "@reduxjs/toolkit";

import { pushEvent } from "../_actions/log";
import { isPythonPathValid } from "../_helpers/python";
import { spawn, exec } from "child_process";

import { packageLocation } from "../_selectors/settings";
import { pythonLocation } from "../_selectors/settings";

import { packageNameSelector, pkgsArraySelector } from "../_selectors/plugins";
import path from "upath";

import { ensureDirectoryReady } from "../_helpers/fileSystem";
import { existsSync, readFile } from "fs";
import config from "../config";

const installationRequested = createAction("plugins/installationRequested");
const installationFinished = createAction("plugins/installationFinished");
const setInstalledVersion = createAction("plugins/setInstalledVersion");
const openPluginHelp = createAction("plugins/openPluginHelp");
const closePluginHelp = createAction("plugins/closePluginHelp");

const getInstalledInfo = () => (dispatch, getState) => {
  const state = getState();
  const pkgLocation = packageLocation(state);
  const allPackages = pkgsArraySelector(state);
  allPackages.forEach(pkg => {
    const pkgPath = path.join(pkgLocation, pkg.packageName);
    const versionFile = path.join(pkgPath, "VERSION");

    readFile(versionFile, "utf-8", (err, version) => {
      dispatch(
        setInstalledVersion({
          name: pkg.name,
          installed: err ? false : version
        })
      );
    });
  });
};

const installPlugin = pluginName => async (dispatch, getState) => {
  dispatch(installationRequested(pluginName));

  const state = getState();
  const packageName = packageNameSelector(state);
  const target = packageLocation(state);
  const pythonLoc = pythonLocation(state);
  const isPythonValid = await isPythonPathValid(pythonLoc, exec);

  if (!isPythonValid) {
    dispatch(pushEvent(`Cant't find Python location: ${pythonLoc}`, "error"));
    dispatch(installationFinished({ pluginName, installed: false }));
    return;
  }
  dispatch(pushEvent(`Found Python location: ${pythonLoc}`, "info"));

  if (!ensureDirectoryReady(target)) {
    dispatch(pushEvent(`Cant't access directory: ${target}`, "error"));
    dispatch(installationFinished({ pluginName, installed: false }));
    return;
  }
  dispatch(pushEvent(`Target directory exists: ${target}`, "info"));

  if (!packageName) {
    dispatch(pushEvent(`Invalid package: ${packageName}`, "error"));
    dispatch(installationFinished({ pluginName, installed: false }));
    return;
  }
  dispatch(pushEvent(`Package is valid: ${packageName}`, "info"));


  // for PIP
  const env = {
    PYTHONPATH: path.join(process.cwd(), ...config.public, "python")
  };
  const shell = true;
  const pipArgs = [
    "-m",
    "pip",
    "install",
    "--upgrade",
    "--prefer-binary",
    ...config.extraPipFlags,
    packageName,
    "--target",
    target
  ];

  const install = spawn(pythonLoc, pipArgs, { env, shell });

  // EVENT HANDLERS
  install.stdout.on("data", data => {
    dispatch(pushEvent(`${data}`, "info"));
  });

  install.stderr.on("data", data => {
    dispatch(pushEvent(`${data}`, "error"));
  });

  install.on("close", code => {
    const msg = `pip install process closed with code ${code}`;
    dispatch(pushEvent(msg, "info"));
    if (code === 0) {
      dispatch(postInstallSetup(pluginName, packageName));
    } else {
      dispatch(
        pushEvent(
          `Can't perform setup because installation returned non-zero exit code ${code}.`,
          "error"
        )
      );
    }
    dispatch(getInstalledInfo());
    dispatch(installationFinished({ pluginName, installed: code === 0 }));
  });

  install.on("exit", code => {
    const msg = `pip install process exited with code ${code}`;
    dispatch(pushEvent(msg, "info"));
    dispatch(installationFinished({ pluginName, installed: true }));
  });

  install.on("error", err => {
    const msg = `pip install process encountered an error ${err}`;
    dispatch(pushEvent(msg, "error"));
    dispatch(installationFinished({ pluginName, installed: false }));
  });
};

const postInstallSetup = (pluginName, packageName) => (dispatch, getState) => {
  const state = getState();
  const installLoc = packageLocation(state);
  const script = path.join(installLoc, packageName, "post_install.py");

  // We don't have to validate pythonLocation because we can't get here without the install
  // step, where it was already validated, at least not for now.

  const pythonLoc = pythonLocation(state);
  if (!existsSync(script)) {
    dispatch(
      pushEvent(`No post_install script exists for: ${pluginName}`, "info")
    );
    dispatch(openPluginHelp(pluginName));
    return;
  }

  dispatch(pushEvent(`Running post install script ${script}`, "info"));

  const env = {
    PYTHONPATH: installLoc
  };



  const postinstall = spawn(pythonLoc, [script], { env });

  postinstall.stdout.on("data", data => {

    dispatch(pushEvent(`${data}`, "info"));
  });
  
  postinstall.stderr.on("data", data => {
    dispatch(pushEvent(`${data}`, "error"));
  });


  postinstall.on("close", code => {
    let msg = `postinstall process closed with code ${code}. Success!`;
    if (code !== 0) {
      msg = `postinstall process closed with code ${code}. Failed`;
    } else {
      dispatch(openPluginHelp(pluginName));
    }
    dispatch(pushEvent(msg, "info"));
  });

  // This event handler likely never gets called. "close" seems more reliable.
  postinstall.on("exit", code => {
    const msg = `postinstall process exited with code ${code}`;
    dispatch(pushEvent(msg, "info"));
  });

  postinstall.on("error", err => {
    const msg = `postinstall process encountered an error ${err}`;
    dispatch(pushEvent(msg, "error"));
  });
};

export {
  installationRequested,
  installationFinished,
  installPlugin,
  postInstallSetup,
  getInstalledInfo,
  setInstalledVersion,
  openPluginHelp,
  closePluginHelp
};
