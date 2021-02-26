import {
  saveSubmission,
  loadSubmission,
  exportSubmissionScript
} from "../submissionPersistence";
// eslint-disable-next-line no-unused-vars
import AppStorage from "../../../_helpers/storage";

const mockAppStorage = {
  load: jest.fn(),
  save: jest.fn(),
  exportSubmissionScript: jest.fn()
};
jest.mock("../../../_helpers/storage", () =>
  jest.fn().mockImplementation(() => mockAppStorage)
);

describe("submission persistence", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
  });

  it("saves a submission", async () => {
    const state = {
      submitter: {
        submission: {}
      }
    };
    const getState = jest.fn().mockReturnValueOnce(state);

    await saveSubmission("/path")(dispatch, getState);

    expect(mockAppStorage.save).toHaveBeenCalledWith("/path", {});
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "submitter/saveSubmissionSuccess",
      payload: "/path"
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "notification/setNotification",
      payload: {
        message: "Successfully saved /path",
        type: "success"
      }
    });
  });

  it("loads a submission", async () => {
    mockAppStorage.load.mockResolvedValueOnce({});

    await loadSubmission("/path")(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "submitter/loadSubmissionSuccess",
      payload: {
        path: "/path",
        submission: {}
      }
    });
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: "notification/setNotification",
      payload: {
        message: "Successfully opened /path",
        type: "success"
      }
    });
  });

  it("exports a submission script", async () => {
    const state = {
      settings: {
        pythonLocation: "python.location",
        packageLocation: "package.location"
      },
      submitter: {
        pythonLocation: "python.location",
        submission: {
          taskTemplate: "",
          assets: [],
          softwarePackages: [],
          environmentOverrides: [],
          outputPath: "",
          instanceType: "",
          jobTitle: "my submission"
        }
      },
      entities: {
        projects: [],
        instanceTypes: {}
      }
    };
    const getState = jest.fn().mockReturnValueOnce(state);

    await exportSubmissionScript("/path")(dispatch, getState);

    expect(mockAppStorage.exportSubmissionScript).toHaveBeenCalledWith(
      "/path",
      expect.stringContaining("import sys"),
      expect.objectContaining({ job_title: "my submission" })
    );

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "submitter/exportSubmissionScriptSuccess",
      payload: "/path"
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "notification/setNotification",
      payload: {
        message: expect.stringContaining(
          `Successfully exported script "/path"`
        ),
        type: "success"
      }
    });
  });
});
