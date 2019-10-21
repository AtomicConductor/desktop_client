import { createReducer } from "redux-starter-kit";

import {
  setJobTitle,
  setFrameSpec,
  setChunkSize,
  setTileSpec,
  setScoutFrameSpec,
  setUseTiles,
  setUseScoutFrames,
  setTaskTemplate,
  setPreemptible,
  setRetries,
  setInstanceTypeIndex,
  setProjectIndex,
  projectsSuccess,
  instanceTypesSuccess
} from "../_actions/submitter";

const initialState = {
  retries: 3,
  preemptible: true,
  chunkSize: 2,
  force: false,
  instanceTypeIndex: 0,
  jobTitle: "Desktop client test",
  localUpload: true,
  uploadOnly: false,
  notify: null,
  frameSpec: "1-10x2",
  tileSpec: "1-9",
  scoutFrameSpec: "1",
  useTiles: false,
  useScoutFrames: false,
  softwarePackageIds: ["32ae46dcb2d20a9c2b33f2b817c0461e"],
  taskTemplate:
    '/tmp/conductor/ct_cnode "/Users/julian/projects/fish/clarisse/refs_test/shot_mac_ct.project" -image project://scene/image1.background project://scene/image1.foreground -image_frames_list <chunk_start> <chunk_start> <chunk_end>',
  uploadPaths: [
    "/Users/julian/projects/fish/clarisse/Maps/alcazar.jpg",
    "/Users/julian/projects/fish/clarisse/Maps/diamonddogs.tif",
    "/Users/julian/projects/fish/clarisse/Maps/thewall.jpg",
    "/Users/julian/projects/fish/clarisse/refs_test/arch_model.project",
    "/Users/julian/projects/fish/clarisse/refs_test/arch_shading.project",
    "/Users/julian/projects/fish/clarisse/refs_test/layout.project",
    "/Users/julian/projects/fish/clarisse/refs_test/lighting.project",
    "/Users/julian/projects/fish/clarisse/refs_test/shot_mac_ct.project",
    "/Users/julian/projects/fish/clarisse/refs_test/walls_shading.project",
    "/tmp/conductor/clarisse.cfg",
    "/tmp/conductor/ct_cnode",
    "/tmp/conductor/ct_prep.py"
  ],
  environment: {
    CONDUCTOR_PATHHELPER: 0,
    ILISE_SERVER: "conductor_ilise:40500",
    LD_LIBRARY_PATH: "/usr/lib/python2.7/config-x86_64-linux-gnu",
    PATH: "/opt/isotropix/clarisse/4/clarisse4.0.sp2/clarisse",
    PYTHONHOME: "/opt/silhouettefx/silhouette/7/silhouette-7.5.2"
  },
  outputPath: "/Users/julian/projects/fish/clarisse/refs_test/renders",
  loading: false,
  framesInfo: "",
  projects: [],
  projectIndex: 0,
  instanceTypes: []
};

export default createReducer(initialState, {
  [setJobTitle]: (state, action) => {
    state["jobTitle"] = action.payload;
  },
  [setFrameSpec]: (state, action) => {
    state["frameSpec"] = action.payload;
  },
  [setChunkSize]: (state, action) => {
    state["chunkSize"] = action.payload;
  },
  [setTileSpec]: (state, action) => {
    state["tileSpec"] = action.payload;
  },
  [setScoutFrameSpec]: (state, action) => {
    state["scoutFrameSpec"] = action.payload;
  },
  [setUseTiles]: (state, action) => {
    state["useTiles"] = action.payload;
  },
  [setUseScoutFrames]: (state, action) => {
    state["useScoutFrames"] = action.payload;
  },
  [setPreemptible]: (state, action) => {
    state["preemptible"] = action.payload;
  },
  [setRetries]: (state, action) => {
    state["retries"] = action.payload;
  },
  [setInstanceTypeIndex]: (state, action) => {
    state["instanceTypeIndex"] = action.payload;
  },
  [setProjectIndex]: (state, action) => {
    state["projectIndex"] = action.payload;
  },

  [setTaskTemplate]: (state, action) => {
    state["taskTemplate"] = action.payload;
  },
  [projectsSuccess]: (state, action) => {
    state.projects = action.payload;
  },
  [instanceTypesSuccess]: (state, action) => {
    state.instanceTypes = action.payload;
  }
});
