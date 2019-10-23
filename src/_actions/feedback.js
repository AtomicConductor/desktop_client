import { setNotification } from "./notification";
import * as axios from "axios";
import { platform, release } from "os";
import config from "../config";
import FeedbackError from "../errors/feedbackError";
import { currentAccountSelector, signedInSelector } from "../selectors/account";

export default (
  feedback,
  os = { platform, release },
  manifestProvider = nw
) => async (dispatch, getState) => {
  try {
    const state = getState();
    const accountId = signedInSelector(state)
      ? currentAccountSelector(state).id
      : null;

    const payload = {
      ...feedback,
      accountId,
      os: {
        platform: os.platform(),
        release: os.release()
      },
      appVersion: manifestProvider.App.manifest.version
    };

    await axios.post(config.feedbackHookUrl, payload);

    dispatch(
      setNotification({
        type: "success",
        snackbar: "Thank you for your feedback!"
      })
    );
  } catch (e) {
    throw new FeedbackError(e);
  }
};
