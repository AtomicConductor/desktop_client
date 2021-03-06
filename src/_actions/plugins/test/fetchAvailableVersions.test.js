import nock from "nock";
import config from "../../../config";
import fetchAvailableVersions from "../fetchAvailableVersions";

describe("fetchAvailableVersions", () => {
  let dispatch, getState;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn().mockReturnValue({
      settings: {
        packageLocation: "/path/to/pkgs",
        pythonLocation: "/path/to/python"
      },
      plugins: {
        items: {
          a: { order: 2, packageName: "pkga", name: "a", available: "pip" },
          b: {
            order: 3,
            packageName: "pkgb",
            name: "b",
            available: "pip"
          },
          c: { order: 1, packageName: "pkgc", name: "c", available: false }
        }
      }
    });

    nock(config.pypi)
      .get(/.*pypi.*json/)
      .times(2)
      .reply(200, {
        info: {
          name: "pkga",
          release_url: "someUrl",
          version: "0.1.35"
        },
        releases: {
          "0.1.30": [
            { upload_time: "2020-09-03T08:13:00", packagetype: "bdist_wheel" },
            { packagetype: "sdist" }
          ],
          "0.1.32": [
            { upload_time: "2020-09-03T08:14:00", packagetype: "bdist_wheel" },
            { packagetype: "sdist" }
          ],
          "0.1.33": [
            { upload_time: "2020-09-03T08:15:00", packagetype: "bdist_wheel" }
          ],
          "0.1.34": [{ packagetype: "sdist" }]
        }
      });
  });

  it("calls dispatch twice for each of the 2 plugins that are available through pip", async () => {
    await fetchAvailableVersions()(dispatch, getState);
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("retrieves the 3 versions for which a wheel is present", async () => {
    await fetchAvailableVersions()(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "plugins/receivePyPiVersions",
      payload: expect.objectContaining({
        versions: expect.arrayContaining(["0.1.30", "0.1.32", "0.1.33"])
      })
    });
  });

  it("orders recent versions first", async () => {
    await fetchAvailableVersions()(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "plugins/receivePyPiVersions",
      payload: expect.objectContaining({
        versions: ["0.1.33", "0.1.32", "0.1.30"]
      })
    });
  });

  it("includes name, and package name in the payload", async () => {
    await fetchAvailableVersions()(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "plugins/receivePyPiVersions",
      payload: expect.objectContaining({
        name: "a",
        packageName: "pkga"
      })
    });
  });
});
