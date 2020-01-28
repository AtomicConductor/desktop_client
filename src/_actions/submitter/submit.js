import { createAction } from "@reduxjs/toolkit";
import desktopClientErrorHandler from "../../middleware/desktopClientErrorHandler";
import { runPythonShell } from "../../_helpers/python";
import { pushEvent } from "../../_actions/log";
import {
  submissionSelector,
  pythonLocation,
  jobTitleSelector
} from "../../selectors/submitter";
import { setNotification } from "../notification";
import DesktopClientError from "../../errors/desktopClientError";
import config from "../../config";

const submissionRequested = createAction("submitter/submissionRequested");
const submissionFinished = createAction("submitter/submissionFinished");

export { submissionRequested, submissionFinished };

export default (
  pythonShell = runPythonShell,
  errorHandler = desktopClientErrorHandler
) => async (dispatch, getState) => {
  const state = getState();

  const pythonPath = pythonLocation(state);
  const args = [JSON.stringify(submissionSelector(state))];
  const title = jobTitleSelector(state);

  const pyshell = await pythonShell("submit.py", { pythonPath, args });

  dispatch(submissionRequested());

  pyshell.on("message", message => {
    dispatch(pushEvent(message, "info"));

    if (!message.match(/response_code/)) {
      return;
    }

    const response = JSON.parse(message);
    if (response.response_code === 201) {
      const notificationMessage = `Successfully submitted job '${title}' to Conductor.`;
      dispatch(
        setNotification({
          message: notificationMessage,
          type: "success",
          url: `${config.dashboardUrl}${response.uri.replace("/jobs", "/job")}`,
          buttonLabel: "view"
        })
      );
      dispatch(pushEvent(notificationMessage, "info"));
      return;
    }

    const error = `Submission failed with response code ${response.response_code}`;
    dispatch(submissionFinished());
    dispatch(errorHandler(new DesktopClientError(error)));
  });

  pyshell.on("stderr", message => {
    dispatch(pushEvent(message, "error"));
  });

  pyshell.on("close", () => {
    dispatch(submissionFinished());
  });

  pyshell.on("error", message => {
    dispatch(errorHandler(new DesktopClientError(message)));
  });
};
