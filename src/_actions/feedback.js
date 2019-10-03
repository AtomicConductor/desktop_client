import { setNotification } from './notification';
import * as axios from 'axios';
import { platform, release } from 'os';
import config from '../config';

export default (
  feedback,
  os = { platform, release },
  manifestProvider = nw
) => async (dispatch, getState) => {

  try {
    const payload = {
      ...feedback,
      accountId: getState().profile.credentials.account,
      os: {
        platform: os.platform(),
        release: os.release()
      },
      appVersion: manifestProvider.App.manifest.version
    };

    await axios.post(config.feedbackHookUrl, payload);

    dispatch(setNotification({
      type: 'success',
      snackbar: 'Thank you for your feedback!'
    }));
  } catch (e) {
    dispatch(setNotification({
      type: 'error',
      snackbar: 'Cannot submit feedback'
    }));
  }
}