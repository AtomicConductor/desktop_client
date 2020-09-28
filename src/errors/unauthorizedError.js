import DesktopClientError from "./desktopClientError";

export default class UnauthorizedError extends DesktopClientError {
  constructor() {
    super("You are not signed in. Some features may be unavailable..");
  }
}
