import { createReducer } from "@reduxjs/toolkit";

import {
  installationRequested,
  installationFinished,
  setInstalledVersion,
  openPluginHelp,
  closePluginHelp
} from "../_actions/plugins/install";

import { receivePyPiVersions } from "../_actions/plugins/fetchAvailableVersions";

const initialState = {
  installing: null,
  helpOpen: false,

  items: {
    core: {
      order: 8,
      title: "Conductor Core & API",
      packageName: "ciocore",
      name: "core",
      description:
        "Installed automatically when you install any other Plugin. Contains upload/download daemons and libraries needed to write submission tools.",
      available: "pip",
      installed: false,
      phase: "beta",
      versions: []
    },
    maya: {
      order: 1,
      title: "Next Gen Maya Submitter",
      packageName: "ciomaya",
      name: "maya",
      description:
        "Experimental native submitter for Maya. Please use our Maya submitter from the Client Tools card for critical production work.",
      available: "pip",
      installed: false,
      phase: "beta",
      versions: []
    },
    nuke: {
      order: 6,
      title: "Nuke Submitter",
      packageName: "cionuke",
      name: "nuke",
      description:
        "The Nuke submitter will soon be available as a PIP package. In the meantime you can find it in Client Tools.",
      available: false,
      installed: false,
      phase: "soon",
      versions: []
    },

    clarisse: {
      order: 3,
      title: "Clarisse Submitter",
      packageName: "cioclarisse",
      name: "clarisse",
      description:
        "This submitter is a Scripted Class in Clarisse. You configure a submission from the Attribute Editor.",
      available: "pip",
      installed: false,
      phase: "beta",
      versions: []
    },
    max: {
      order: 7,
      title: "3ds Max Submitter",
      packageName: "ciomax",
      name: "max",
      description: "New native submitter for Autodesk's 3ds Max!",
      available: "pip",
      installed: false,
      phase: "beta",
      versions: []
    },
    c4d: {
      order: 2,
      title: "Cinema 4D Submitter",
      packageName: "cioc4d",
      name: "c4d",
      description:
        "New native submitter for Maxon's Cinema4D. Render with Redshift on Conductor!",
      available: "pip",
      installed: false,
      phase: "beta",
      versions: []
    },
    katana: {
      order: 5,
      title: "Katana Submitter",
      packageName: "ciokatana",
      name: "katana",
      description:
        "A native Katana submitter UI is in the works, with support for Renderman, Arnold and Redshift. In the meantime, you can craft Katana submissions through the Submission Kit.",
      available: false,
      installed: false,
      phase: "soon",
      versions: []
    }
  }
};

const plugins = createReducer(initialState, {
  [installationRequested]: (state, action) => {
    const pluginName = action.payload;
    if (pluginName in state.items && state.items[pluginName].available) {
      state.installing = pluginName;
    }
  },

  [installationFinished]: (state, action) => {
    state.installing = null;
  },

  [setInstalledVersion]: (state, action) => {
    const { name, installed } = action.payload;
    if (name in state.items) {
      state.items[name].installed = installed;
    }
  },

  [openPluginHelp]: (state, action) => {
    const name = action.payload;
    state.helpOpen = name in state.items && name;
  },

  [closePluginHelp]: (state, action) => {
    state.helpOpen = false;
  },

  [receivePyPiVersions]: (state, action) => {
    const { name, versions } = action.payload;
    if (name in state.items) {
      state.items[name].versions = versions;
    }
  }
});

export default plugins;
