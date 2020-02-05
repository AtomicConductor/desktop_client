import { downloadFileTask } from "../files";
import { DownloaderHelper } from "node-downloader-helper";
import DesktopClientErrorHandler from "../../middleware/desktopClientErrorHandler";
import {
  ensureDirectoryReady,
  exactFileExists
} from "../../_helpers/fileSystem";
import { EventEmitter } from "events";
jest.mock("node-downloader-helper");
jest.mock("../../_helpers/fileSystem");
jest.mock("../../middleware/desktopClientErrorHandler");

let downloaderHelperMock,
  dispatch,
  originalDate = global.Date.now;
beforeEach(() => {
  global.Date.now = jest.fn();
  dispatch = jest.fn();
  DownloaderHelper.mockClear();

  class DownloaderHelperMock extends EventEmitter {
    constructor() {
      super();
      this.start = jest.fn();
    }
  }

  downloaderHelperMock = new DownloaderHelperMock();
  DownloaderHelper.mockImplementation(() => downloaderHelperMock);
});

afterEach(() => {
  global.Date.now = originalDate;
});

describe("download file task", () => {
  it("does not download a file if it already exits", async () => {
    ensureDirectoryReady.mockResolvedValueOnce(true);
    exactFileExists.mockResolvedValueOnce(true);

    await downloadFileTask({
      relativePath: "file",
      outputDirectory: "/downloads"
    })();

    expect(DownloaderHelper).not.toHaveBeenCalled();
  });

  it("does not download a file if outputDirectory does not exist", async () => {
    ensureDirectoryReady.mockResolvedValueOnce(false);
    exactFileExists.mockResolvedValueOnce(false);

    await downloadFileTask({
      relativePath: "file",
      outputDirectory: "/downloads"
    })();

    expect(DownloaderHelper).not.toHaveBeenCalled();
  });

  it("starts downloading a file", async () => {
    ensureDirectoryReady.mockResolvedValueOnce(true);
    exactFileExists.mockResolvedValueOnce(false);

    await downloadFileTask({
      url: "/file-url",
      relativePath: "file",
      outputDirectory: "/downloads"
    })();

    expect(DownloaderHelper).toHaveBeenCalledWith("/file-url", "/downloads", {
      override: true,
      fileName: "file",
      retry: { maxRetries: 3, delay: 1000 }
    });
    expect(downloaderHelperMock.start).toHaveBeenCalled();
  });

  it("handles download errors", async () => {
    ensureDirectoryReady.mockResolvedValueOnce(true);
    exactFileExists.mockResolvedValueOnce(false);

    await downloadFileTask(
      {
        relativePath: "file",
        outputDirectory: "/downloads",
        jobLabel: "my job"
      },
      dispatch
    )();
    downloaderHelperMock.emit("error");

    expect(DesktopClientErrorHandler).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: "downloader/setFileExists",
      payload: {
        jobLabel: "my job",
        relativePath: "file",
        percentage: -1
      }
    });
  });

  it("sets progress to 100% when download is finished", async () => {
    ensureDirectoryReady.mockResolvedValueOnce(true);
    exactFileExists.mockResolvedValueOnce(false);

    await downloadFileTask(
      {
        relativePath: "file",
        outputDirectory: "/downloads",
        jobLabel: "my job"
      },
      dispatch
    )();
    downloaderHelperMock.emit("end");

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ percentage: 100 })
      })
    );
  });

  it("reports download progress at most once a second", async () => {
    ensureDirectoryReady.mockResolvedValueOnce(true);
    exactFileExists.mockResolvedValueOnce(false);
    global.Date.now
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(250)
      .mockReturnValueOnce(500)
      .mockReturnValueOnce(1001);

    await downloadFileTask(
      {
        relativePath: "file",
        outputDirectory: "/downloads",
        jobLabel: "my job"
      },
      dispatch
    )();

    downloaderHelperMock.emit("progress", { progress: "42" });
    downloaderHelperMock.emit("progress", { progress: "45" });
    downloaderHelperMock.emit("progress", { progress: "47" });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ percentage: 47 })
      })
    );
  });
});
