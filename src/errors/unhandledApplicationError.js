import DesktopClientError from "./desktopClientError";

export default class UnhandledApplicationError extends DesktopClientError {
  constructor(inner) {
    super("Can't perform action", inner);
  }
}
