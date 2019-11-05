import DesktopClientError from "./desktopClientError";

export default class UnauthorizedError extends DesktopClientError {
  constructor() {
    super("Your session has expired, please sign-in again.");
  }
}
