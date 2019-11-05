import DesktopClientError from "./desktopClientError";

export default class JobsError extends DesktopClientError {
  constructor(inner) {
    super("Can't fetch jobs", inner);
  }
}
