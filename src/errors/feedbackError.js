import DesktopClientError from "./desktopClientError";

export default class FeedbackError extends DesktopClientError {
  constructor(inner) {
    super("Can't submit feedback", inner);
  }
}
