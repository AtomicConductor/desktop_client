import { saveSubmission, loadSubmission } from "../submissionPersistence";
// eslint-disable-next-line no-unused-vars
import AppStorage from "../../../_helpers/storage";

const mockAppStorage = {
  load: jest.fn(),
  save: jest.fn()
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
});
