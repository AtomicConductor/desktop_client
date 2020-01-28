import { createAction } from "@reduxjs/toolkit";

const setJobTitle = createAction("submitter/setJobTitle");
const setFrameSpec = createAction("submitter/setFrameSpec");
const setChunkSize = createAction("submitter/setChunkSize");
const setTileSpec = createAction("submitter/setTileSpec");
const setScoutFrameSpec = createAction("submitter/setScoutFrameSpec");
const setUseTiles = createAction("submitter/setUseTiles");
const setUseScoutFrames = createAction("submitter/setUseScoutFrames");
const setPreemptible = createAction("submitter/setPreemptible");
const setRetries = createAction("submitter/setRetries");
const setOutputPath = createAction("submitter/setOutputPath");
const addAssets = createAction("submitter/addAssets");
const removeAssets = createAction("submitter/removeAssets");
const applyResetSubmission = createAction("submitter/applyResetSubmission");
const updateSelectedSoftware = createAction("submitter/updateSelectedSoftware");
const setEnvEntry = createAction("submitter/setEnvEntry");
const setSubmissionResponse = createAction("submitter/setSubmissionResponse");

export {
  setJobTitle,
  setFrameSpec,
  setChunkSize,
  setTileSpec,
  setScoutFrameSpec,
  setUseTiles,
  setUseScoutFrames,
  setPreemptible,
  setRetries,
  setOutputPath,
  addAssets,
  removeAssets,
  applyResetSubmission,
  updateSelectedSoftware,
  setEnvEntry,
  setSubmissionResponse
};
