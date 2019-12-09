import { decode } from "jwt-simple";
import { tokenSelector } from "../selectors/account";
import AppStorage from "../_helpers/storage";
import { pushEvent } from "../_actions/log";
import DesktopClientError from "../errors/desktopClientError";

export default (storage = new AppStorage(), decoder = decode) => async (
  dispatch,
  getState
) => {
  try {
    const token = tokenSelector(getState());
    const secret = "";
    const noVerify = true;
    const { exp } = decoder(token, secret, noVerify);

    const credentials = {
      access_token: token,
      token_type: "Bearer",
      expiration: exp,
      scope: ["user"]
    };

    await storage.writeClientToolsCredentials(credentials);

    dispatch(pushEvent("Signed in to client tools", "info"));
  } catch (e) {
    throw new DesktopClientError("Can't sign in to client tools");
  }
};
