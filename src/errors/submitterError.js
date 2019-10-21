import DesktopClientError from "./desktopClientError";

export default class SubmitterError extends DesktopClientError {
  constructor(inner) {
    super("Can't continue submission", inner);
  }
}
