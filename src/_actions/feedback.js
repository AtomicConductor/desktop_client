import { setNotification } from "./notification";
import axios from "../_helpers/axios";
import { platform, release } from "os";
import config from "../config";
import { currentAccountSelector, signedInSelector } from "../selectors/account";

export default (
  feedback,
  os = { platform, release },
  manifestProvider = nw
) => async (dispatch, getState) => {
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
      message: "Thank you for your feedback!"
    })
  );
};
