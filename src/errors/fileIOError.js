import DesktopClientError from "./desktopClientError";

export default class FileIOError extends DesktopClientError {
  constructor(inner) {
    super("Error reading or writing file", inner);
  }
}
