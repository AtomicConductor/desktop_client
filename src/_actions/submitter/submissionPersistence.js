import { createAction } from "@reduxjs/toolkit";
import { setNotification } from "../notification";
import AppStorage from "../../_helpers/storage";
import {
  instanceTypesMapSelector,
  instanceTypesSelector
} from "../../_selectors/entities";

import {
  submissionScriptSelector,
  submissionSelector
} from "../../_selectors/submitter";

import { setInstanceType } from "../submitter/fetchInstanceTypes";
import { pushEvent } from "../../_actions/log";
const saveSubmissionSuccess = createAction("submitter/saveSubmissionSuccess");
const loadSubmissionSuccess = createAction("submitter/loadSubmissionSuccess");
const updateSelectedSoftware = createAction("submitter/updateSelectedSoftware");
const exportSubmissionScriptSuccess = createAction(
  "submitter/exportSubmissionScriptSuccess"
);

const saveSubmission = path => async (dispatch, getState) => {
  const storage = new AppStorage();
  await storage.save(path, getState().submitter.submission);
  dispatch(saveSubmissionSuccess(path));
  dispatch(
    setNotification({
      message: `Successfully saved ${path}`,
      type: "success"
    })
  );
};

const loadSubmission = path => async dispatch => {
  const storage = new AppStorage();
  const submission = await storage.load(path);

  dispatch(loadSubmissionSuccess({ path, submission }));
  dispatch(syncStateWithLoadedSubmission(submission));

  dispatch(
    setNotification({
      message: `Successfully opened ${path}`,
      type: "success"
    })
  );
};

const exportSubmissionScript = path => async (dispatch, getState) => {
  const storage = new AppStorage();
  const state = getState();
  const payload = submissionSelector(state);
  const script = submissionScriptSelector(state);

  await storage.exportSubmissionScript(path, script, payload);

  dispatch(exportSubmissionScriptSuccess(path));
  const message = `Successfully exported script "${path}". Now open a terminal and enter "python ${path}"`;
  dispatch(
    setNotification({
      message,
      type: "success"
    })
  );
  dispatch(pushEvent(message, "info"));
};

//TODO: investigate other options
const syncStateWithLoadedSubmission = submission => async (
  dispatch,
  getState
) => {
  const state = getState();
  const instanceTypesMap = instanceTypesMapSelector(state);

  let instanceType = instanceTypesSelector(state)[0];
  if (instanceTypesMap.hasOwnProperty(submission.instanceType.name)) {
    instanceType = instanceTypesMap[submission.instanceType.name];
  } else {
    dispatch(
      pushEvent(
        `Loaded instance type ${submission.instanceType.name} not available, resetting to ${instanceType.name}.`
      )
    );
  }
  dispatch(setInstanceType(instanceType));

  const { softwarePackages } = state.entities;
  submission.softwarePackages.forEach(
    ({ softwareKey, package: { id } }, index) => {
      if (!softwarePackages[softwareKey]) return;
      const pkg = softwarePackages[softwareKey].packages.find(_ => _.id === id);
      dispatch(updateSelectedSoftware({ index, softwareKey, package: pkg }));
    }
  );
};
export {
  saveSubmission,
  loadSubmission,
  exportSubmissionScript,
  saveSubmissionSuccess,
  loadSubmissionSuccess,
  exportSubmissionScriptSuccess
};
