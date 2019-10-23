import { fetchSoftwarePackages } from "../submitter";
import nock from "nock";
import config from "../../config";

describe("submitter", () => {
  it("retrieves software packages", async () => {
    const dispatch = jest.fn();
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
