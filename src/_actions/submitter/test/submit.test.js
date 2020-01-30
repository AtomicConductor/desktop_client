import { submit, submitWithValidation } from "../submit";
import config from "../../../config";
import { EventEmitter } from "events";
import { pathExists } from "../../../_helpers/fileSystem";
import {
  submissionValidSelector,
  assetsMap
} from "../../../selectors/submitter";
jest.mock("../../../_helpers/fileSystem");
jest.mock("../../../selectors/submitter");

describe("submitter actions", () => {
  describe("submitWithValidation", () => {
    let dispatch, getState;
    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("creates a validation report with errors, alerts and missing assets", async () => {
      assetsMap.mockReturnValueOnce({
        "/exists asset": {},
        "/missing asset": {}
      });
      pathExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      submissionValidSelector.mockReturnValueOnce({ errors: [], alerts: [] });

      await submitWithValidation()(dispatch, getState);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: "submitter/validationRequested"
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: "submitter/validationFinished",
        payload: expect.objectContaining({
          alerts: expect.any(Array),
          errors: [
            "Some assets no longer exist on disk, please remove them from the files tab."
          ],
          missingAssets: ["/missing asset"]
        })
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it("submits when there are no erros", async () => {
      assetsMap.mockReturnValueOnce({});
      pathExists.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
      submissionValidSelector.mockReturnValueOnce({ errors: [], alerts: [] });

      await submitWithValidation()(dispatch, getState);

      expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    });
  });

  describe("submit", () => {
    let dispatch, getState, pythonShellStub;

    class PythonShellStub extends EventEmitter {
      end(handler) {
        handler(undefined);
      }
    }

    beforeEach(() => {
      dispatch = jest.fn();
      pythonShellStub = new PythonShellStub();
      getState = jest.fn().mockReturnValue({
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
      });
    });

    it("handles a message with no response code", async () => {
      await submit(() => pythonShellStub)(dispatch, getState);
      pythonShellStub.emit("message", "no response code");

      expect(dispatch).toHaveBeenCalledTimes(2);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: "submitter/submissionRequested",
        payload: undefined
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: "log/pushEvent",
        payload: expect.objectContaining({
          text: "no response code",
          level: "info"
        })
      });
    });

    it("returns 201 accepted response code", async () => {
      await submit(() => pythonShellStub)(dispatch, getState);
      pythonShellStub.emit(
        "message",
        JSON.stringify({ response_code: 201, uri: "/jobs" })
      );

      expect(dispatch).toHaveBeenCalledTimes(4);
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: "notification/setNotification",
        payload: {
          buttonLabel: "view",
          message: expect.stringMatching(/Success.*submit.*/),
          type: "success",
          url: `${config.dashboardUrl}/job`
        }
      });

      expect(dispatch).toHaveBeenNthCalledWith(4, {
        type: "log/pushEvent",
        payload: expect.objectContaining({
          text: expect.stringMatching(/Success.*submit.*/),
          level: "info"
        })
      });
    });

    it("dispatches finished action on close event", async () => {
      await submit(() => pythonShellStub)(dispatch, getState);
      pythonShellStub.emit("close", "process exited with error");

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: "submitter/submissionFinished",
        payload: undefined
      });
    });

    it("dispatches middleware error handler when shell execution ends with error", async () => {
      const errorHandler = jest.fn();

      await submit(() => pythonShellStub, errorHandler)(dispatch, getState);
      pythonShellStub.emit("error", "process exited with error");

      expect(errorHandler).toHaveBeenCalledWith(
        new Error("process exited with error")
      );
    });

    it("dispatches middleware error handler for non 201 response codes", async () => {
      const errorHandler = jest.fn();
      await submit(() => pythonShellStub, errorHandler)(dispatch, getState);
      pythonShellStub.emit("message", JSON.stringify({ response_code: 404 }));

      expect(errorHandler).toHaveBeenCalledWith(
        new Error("Submission failed with response code 404")
      );
    });
  });
});
