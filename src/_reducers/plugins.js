import os from "os";
import path from "upath";
import { createReducer } from "redux-starter-kit";

// import { DEFAULT_PLUGIN_INSTALL_PATHS } from "../_helpers/constants.js";
import {
  setInstallPathValue,
  resetInstallPathValue,
  installPlugin,
  uninstallPlugin
} from "../_actions/plugins";

// import { receiveUser, profileFailure } from "../_actions/profile";
// import { envFailure } from "../_actions/environment";
// import { runDownloadJobs } from "../_actions/downloader";

// import {
//   pythonScriptFailure,
//   setPythonScriptResponse
// } from "../_actions/python";

const HOME = os.homedir();

const initialState = {
  items: {
    maya: {
      order: 1,
      title: "Maya Submitter",
      name: "maya",
      description:
        "Installs the Conductor submitter UI for Autodesk Maya as a module. Once installed, access the UI from the Conductor menu.",
      installDirectory: path.join(HOME, "Conductor", "maya"),
      defaultInstallDirectory: path.join(HOME, "Conductor", "maya"),
      installed: false
    },
    nuke: {
      order: 2,
      title: "Nuke Submitter",
      name: "nuke",
      description:
        "Installs the Conductor submitter UI for Nuke by the Foundry. Once installed, access the UI from the Plugins menu.",
      installDirectory: path.join(HOME, "Conductor", "nuke"),
      defaultInstallDirectory: path.join(HOME, "Conductor", "nuke"),
      installed: false
    },

    clarisse: {
      order: 3,
      title: "Clarisse Submitter",
      name: "clarisse",
      description:
        "Installs the Conductor scripted class for Isotropix Clarisse. Once installed, access the UI from the Create Item menu. You can make as many ConductorJob items as you wish",
      installDirectory: path.join(HOME, "Conductor", "clarisse"),
      defaultInstallDirectory: path.join(HOME, "Conductor", "clarisse"),
      installed: false
    },
    silhouette: {
      order: 4,
      title: "Silhouette Submitter",
      name: "silhouette",
      description:
        "Installs the Conductor menu in Silhouette. Once installed, access the UI from the Create menu.",
      installDirectory: path.join(HOME, "Conductor", "silhouette"),
      defaultInstallDirectory: path.join(HOME, "Conductor", "silhouette"),
      installed: false
    },
    c4d: {
      order: 5,
      title: "Cinema 4D Submitter",
      name: "c4d",
      description:
        "Installs the Conductor submitter for Maxon's Cinema 4D. Once installed, access the UI from the Create menu.",
      installDirectory: path.join(HOME, "Conductor", "c4d"),
      defaultInstallDirectory: path.join(HOME, "Conductor", "c4d"),
      installed: false
    },
    katana: {
      order: 6,
      title: "Katana Submitter",
      name: "katana",
      description:
        "Installs the Conductor submitter for Katana by the Foundry. Once installed, access the UI from the Create menu.",
      installDirectory: path.join(HOME, "Conductor", "katana"),
      defaultInstallDirectory: path.join(HOME, "Conductor", "katana"),
      installed: false
    }
  }
};

const plugins = createReducer(initialState, {
  [setInstallPathValue]: (state, action) => {
    const { pluginName, value } = action.payload;
    console.log(pluginName + "  " + value);
    if (pluginName in state["items"]) {
      state["items"][pluginName]["installDirectory"] = value;
    }
  },

  [resetInstallPathValue]: (state, action) => {
    const { pluginName } = action.payload;
    if (pluginName in state["items"]) {
      state["items"][pluginName]["installDirectory"] =
        state["items"][pluginName]["defaultInstallDirectory"];
    }
  },

  [installPlugin]: (state, action) => {
    const pluginName = action.payload;
    console.log(pluginName);
    if (pluginName in state["items"]) {
      state["items"][pluginName]["installed"] = true;
    }
  },

  [uninstallPlugin]: (state, action) => {
    const pluginName = action.payload;
    if (pluginName in state["items"]) {
      state["items"][pluginName]["installed"] = false;
    }
  }

  // [clearNotification]: (state, action) => {
  //   Object.assign(state, initialState);
  // },
  // [showNotificationDetails]: (state, action) => {
  //   state.show = !!action.payload.detail ? "detail" : "none";
  // },
  // [setNotification]: (state, action) => {
  //   state.snackbar = action.payload.snackbar;
  //   state.detail = action.payload.detail || "";
  //   state.show = !!action.payload ? "snackbar" : "none";
  //   state.type = action.payload.type;
  // },
  // [profileFailure]: (state, action) => {
  //   state.snackbar = action.payload;
  //   state.detail = `Some more details ${action.payload}`;
  //   state.show = !!action.payload ? "snackbar" : "none";
  //   state.type = "error";
  // },
  // // [receiveUser]: (state, action) => {
  // //   state.snackbar = "Successfully signed in";
  // //   state.detail = "";
  // //   state.show = "snackbar";
  // //   state.type = "success";
  // // },
  // [envFailure]: (state, action) => {
  //   state.snackbar = action.payload;
  //   state.detail = `Some more details ${action.payload}`;
  //   state.show = !!action.payload ? "snackbar" : "none";
  //   state.type = "error";
  // }
});

export default plugins;
