import { createReducer } from "redux-starter-kit";
import { isDeepStrictEqual } from "util";
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
  setInstanceType,
  setProject,
  projectsSuccess,
  setOutputPath,
  addAssets,
  removeAssets,
  updateSelectedSoftware,
  saveSubmissionSuccess,
  loadSubmissionSuccess,
  applyResetSubmission,
  setEnvEntry,
  setPythonLocation
} from "../_actions/submitter";

const initialState = {
  filename: "",
  loading: false,
  pythonLocation: "/Users/julian/.virtualenvs/ccc/bin/python",
  submission: {
    retries: 3,
    preemptible: true,
    chunkSize: 1,
    force: false,
    instanceType: { name: "", description: "" },
    jobTitle: "Desktop client test",
    localUpload: true,
    uploadOnly: false,
    notify: null,
    frameSpec: "1-10",
    tileSpec: "1-9",
    scoutFrameSpec: "1",
    useTiles: false,
    useScoutFrames: false,
    softwarePackages: [{ softwareKey: "", package: {} }],
    taskTemplate: "",
    uploadPaths: [],
    assets: {},
    environmentOverrides: [{ key: "", value: "" }],
    environment: {},
    project: "",
    outputPath: "/tmp/renders"
  }
};

export default createReducer(initialState, {
  [setJobTitle]: (state, { payload }) => {
    state.submission.jobTitle = payload;
  },
  [setFrameSpec]: (state, { payload }) => {
    state.submission.frameSpec = payload;
  },
  [setChunkSize]: (state, { payload }) => {
    state.submission.chunkSize = Math.max(Math.trunc(payload), 1);
  },
  [setTileSpec]: (state, { payload }) => {
    state.submission.tileSpec = payload;
  },
  [setScoutFrameSpec]: (state, { payload }) => {
    state.submission.scoutFrameSpec = payload;
  },
  [setUseTiles]: (state, { payload }) => {
    state.submission.useTiles = payload;
  },
  [setUseScoutFrames]: (state, { payload }) => {
    state.submission.useScoutFrames = payload;
  },
  [setPreemptible]: (state, { payload }) => {
    state.submission.preemptible = payload;
  },
  [setRetries]: (state, { payload }) => {
    state.submission.retries = Math.max(Math.trunc(payload), 0);
  },
  [setInstanceType]: (state, { payload }) => {
    state.submission.instanceType = payload;
  },
  [setProject]: (state, { payload }) => {
    state.submission.project = payload;
  },
  [setOutputPath]: (state, { payload }) => {
    state.submission.outputPath = payload;
  },

  [setTaskTemplate]: (state, { payload }) => {
    state.submission.taskTemplate = payload;
  },
  [projectsSuccess]: (state, { payload }) => {
    /**
     * If there is a project already set which is in the list of projects, just leave it.
     * Otherwise, tryto set the default project. In the last resort, set to the first project in the list
     *
     */
    if (payload.length) {
      if (!payload.some(_ => state.submission.project === _)) {
        if (!payload.some(_ => "default" === _)) {
          state.submission.project = "default";
        } else {
          state.submission.project = payload.sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
          )[0];
        }
      }
    }
  },
  [addAssets]: (state, { payload }) => {
    state.submission.assets = {
      ...state.submission.assets,
      ...payload
    };
  },
  [removeAssets]: (state, { payload }) => {
    payload.forEach(_ => {
      if (state.submission.assets.hasOwnProperty(_)) {
        delete state.submission.assets[_];
      }
    });
  },

  [updateSelectedSoftware]: (state, { payload }) => {
    const {
      submission: { softwarePackages }
    } = state;
    const { index, softwareKey, package: pkg } = payload;
    const removeSoftware = softwareKey === "" && pkg === "";
    const emptyEntry = { softwareKey: "", package: {} };
    const nonEmptyEntryPredicate = _ => !isDeepStrictEqual(_, emptyEntry);

    if (removeSoftware) {
      softwarePackages.splice(index, 1);
    } else {
      softwarePackages[index] = {
        softwareKey,
        package: pkg
      };
    }

    state.submission.softwarePackages = [
      ...softwarePackages.filter(nonEmptyEntryPredicate),
      emptyEntry
    ];
  },
  [saveSubmissionSuccess]: (state, { payload }) => {
    state.filename = payload;
  },
  [loadSubmissionSuccess]: (state, { payload }) => {
    state.submission = payload.submission;
    state.filename = payload.path;
  },
  [applyResetSubmission]: state => {
    state.filename = "";
    state.submission = initialState.submission;
  },

  [setEnvEntry]: (state, { payload }) => {
    const { key, value, index } = payload;
    const { environmentOverrides } = state.submission;
    const emptyEntry = { key: "", value: "" };
    const nonEmptyEntryPredicate = _ =>
      _.key.trim() !== "" || _.value.trim() !== "";

    if (key !== null) {
      environmentOverrides[index].key = key;
    }
    if (value !== null) {
      environmentOverrides[index].value = value;
    }

    state.submission.environmentOverrides = [
      ...environmentOverrides.filter(nonEmptyEntryPredicate),
      emptyEntry
    ];
  },

  [setPythonLocation]: (state, { payload }) => {
    state.pythonLocation = payload;
  }
});
