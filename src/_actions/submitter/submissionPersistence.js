import { createAction } from "@reduxjs/toolkit";
import { setNotification } from "../notification";
import AppStorage from "../../_helpers/storage";
import {
  instanceTypesMapSelector,
  instanceTypesSelector
} from "../../_selectors/entities";
import { setInstanceType } from "../submitter/fetchInstanceTypes";
import { pushEvent } from "../../_actions/log";
const saveSubmissionSuccess = createAction("submitter/saveSubmissionSuccess");
const loadSubmissionSuccess = createAction("submitter/loadSubmissionSuccess");
const updateSelectedSoftware = createAction("submitter/updateSelectedSoftware");

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
  saveSubmissionSuccess,
  loadSubmissionSuccess
};
