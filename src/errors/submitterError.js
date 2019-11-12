import DesktopClientError from "./desktopClientError";

export default class SubmitterError extends DesktopClientError {
  constructor(inner) {
    super("Error with the submission", inner);
  }
}
