import DesktopClientError from "./desktopClientError";

export default class DownloaderError extends DesktopClientError {
  constructor(inner) {
    super("Can't add file to download queue", inner);
  }
}
