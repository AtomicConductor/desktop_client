import DesktopClientError from "./desktopClientError";

export default class SignInError extends DesktopClientError {
  constructor(inner) {
    super("Can't sign in", inner);
  }
}
