import { createReducer } from "@reduxjs/toolkit";

import {
  installationRequested,
  installationFinished,
  setInstalledVersion,
  openPluginHelp,
  closePluginHelp
} from "../_actions/plugins";

const initialState = {
  installing: null,
  helpOpen: false,

  items: {
    client_tools: {
      order: 4,
      title: "Client Tools",
      packageName: "conductor_client",
      name: "client_tools",
      description:
        "Stay up to date with the latest version of the conductor client tools. Bundle includes integrations for Maya, Nuke, Clarisse and our Python API.",
      available: "github",
      installed: false,
      phase: "stable",
      darwin_url:
        "https://github.com/AtomicConductor/conductor_client/releases/download/v2.16.0/conductor-v2.16.0.pkg",
      linux_url:
        "https://github.com/AtomicConductor/conductor_client/releases/download/v2.16.0/conductor-v2.16.0-0.el7.x86_64.rpm",
      win32_url:
        "https://github.com/AtomicConductor/conductor_client/releases/download/v2.16.0/conductor-v2.16.0.exe"
    },
    core: {
      order: 8,
      title: "Conductor Core & API",
      packageName: "ciocore",
      name: "core",
      description:
        "Installed automatically when you install any other Plugin. Contains upload/download daemons and libraries needed to write submission tools.",
      available: "pip",
      installed: false,
      phase: "beta"
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
      phase: "beta"
    },
    nuke: {
      order: 6,
      title: "Nuke Submitter",
      packageName: "cionuke",
      name: "nuke",
      description:
        "The Nuke submitter will soon be available as a PIP package. In the meantime, please download it through the Client Tools card.",
      available: false,
      installed: false,
      phase: "soon"
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
      phase: "beta"
    },
    max: {
      order: 7,
      title: "3Ds Max Submitter",
      packageName: "ciomax",
      name: "max",
      description:
        "Native 3dsMax submitter UI coming later this year, Watch this space.",
      available: false,
      installed: false,
      phase: "soon"
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
      phase: "beta"
    },
    katana: {
      order: 5,
      title: "Katana Submitter",
      packageName: "ciokatana",
      name: "katana",
      description:
        "A native Katana submitter UI in the works, with support for Renderman, Arnold and Redshift. In the meantime, you can craft Katana submissions through the Submission Kit.",
      available: false,
      installed: false,
      phase: "soon"
    }
  }
};

const plugins = createReducer(initialState, {
  [installationRequested]: (state, action) => {
    const pluginName = action.payload;
    state.installing = pluginName;

    if (
      pluginName in state.items &&
      state.items[pluginName].available === true
    ) {
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
  }
});

export default plugins;
