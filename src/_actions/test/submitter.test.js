import {
  fetchSoftwarePackages,
  insertTaskTemplateToken,
  submit,
  loadPythonLocation,
  savePythonLocation,
  resetPythonLocation
} from "../submitter";
import nock from "nock";
import config from "../../config";
import { settings } from "../../_helpers/constants";
import { EventEmitter } from "events";

describe("submitter", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
    global.localStorage.__proto__ = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };
  });

  describe("fetchSoftwarePackages", () => {
    it("retrieves software packages", async () => {
      nock(config.dashboardUrl)
        .get("/api/v1/ee/packages")
        .reply(200, {
          data: [
            {
              product: "product 2",
              major_version: "1",
              minor_version: "2",
              release_version: "3",
              build_version: "4",
              package_id: "product_2_package_1",
              plugin_host_product: "host 1",
              plugin_host_version: "2019",
              environment: {
                var: "var"
              }
            },
            {
              product: "product 1",
              major_version: "1",
              minor_version: "",
              release_version: "",
              build_version: "",
              package_id: "product_1_package_1",
              plugin_host_product: "",
              plugin_host_version: "",
              environment: {}
            },
            {
              product: "product 1",
              major_version: "2",
              minor_version: "3",
              release_version: "",
              build_version: "",
              package_id: "product_1_package_2",
              plugin_host_product: "",
              plugin_host_version: "",
              environment: {}
            },
            {
              product: "houdini"
            }
          ]
        });

      await fetchSoftwarePackages()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/softwarePackagesSuccess",
        payload: {
          "product 1": {
            packages: [
              {
                id: "product_1_package_2",
                version: "2.3.0",
                environment: {}
              },
              {
                id: "product_1_package_1",
                version: "1.0.0",
                environment: {}
              }
            ]
          },
          "product 2": {
            packages: [
              {
                id: "product_2_package_1",
                version: "1.2.3-4 (host 1 2019)",
                environment: {
                  var: "var"
                }
              }
            ]
          }
        }
      });
    });
  });

  describe("insertTaskTemplateToken", () => {
    const getState = jest.fn().mockReturnValue({
      submitter: {
        submission: { taskTemplate: "cmd start param " }
      }
    });

    it("inserts a token at cursor position into a task template", async () => {
      await insertTaskTemplateToken({
        token: "chunk_end",
        start: 16,
        end: 16
      })(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setTaskTemplate",
        payload: "cmd start param <chunk_end>"
      });
    });

    it("overrides highlighted text with selected token", async () => {
      await insertTaskTemplateToken({
        token: "chunk_start",
        start: 4,
        end: 9
      })(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setTaskTemplate",
        payload: "cmd <chunk_start> param "
      });
    });
  });

  describe("loadPythonLocation", () => {
    let pythonPathValidator = jest.fn(() => true);
    it("resolves and saves python path if not already present in localstorage", async () => {
      const pythonPathResolver = jest
        .fn()
        .mockReturnValueOnce("/saved/path/python");

      const dispatcher = _ => _(dispatch);
      await loadPythonLocation(
        pythonPathResolver,
        pythonPathValidator
      )(dispatcher);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        settings.pythonLocation,
        "/saved/path/python"
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPythonLocation",
        payload: "/saved/path/python"
      });
    });

    it("loads python path from locastorage if already present", async () => {
      localStorage.getItem.mockReturnValueOnce("saved/path");

      await loadPythonLocation(null, pythonPathValidator)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPythonLocation",
        payload: "saved/path"
      });
    });
  });

  describe("savePythonLocation", () => {
    it("throw an exception when python path is invalid", async () => {
      const pythonPathValidator = jest.fn(() => false);

      await expect(
        savePythonLocation("/python/path", pythonPathValidator)(null)
      ).rejects.toThrow("Invalid python 2.7 location");

      expect(pythonPathValidator).toHaveBeenCalledWith("/python/path");
    });
  });

  describe("resetPythonPath", () => {
    it("resolves and saves default Python path", async () => {
      const pythonPathValidator = jest.fn(() => true);
      const pythonPathResolver = jest.fn(() => "default/python/path");

      const dispatcher = _ => _(dispatch);
      await resetPythonLocation(
        pythonPathResolver,
        pythonPathValidator
      )(dispatcher);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setPythonLocation",
        payload: "default/python/path"
      });
    });
  });

  describe("submit", () => {
    const getState = jest.fn().mockReturnValue({
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

    class PythonShellStub extends EventEmitter {
      end(handler) {
        handler(undefined);
      }
    }

    let pythonShellStub;

    beforeEach(() => {
      pythonShellStub = new PythonShellStub();
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
