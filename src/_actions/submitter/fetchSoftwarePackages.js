import axios from "../../_helpers/axios";
import config from "../../config";
import { createAction } from "@reduxjs/toolkit";

const softwarePackagesSuccess = createAction(
  "submitter/softwarePackagesSuccess"
);

//TODO: remove all mapping code into a normalizer
const mapPackages = software => {
  const softwarePackagesProjection = ({
    product,
    major_version,
    minor_version,
    release_version,
    build_version,
    package_id: id,
    plugin_host_product: host,
    plugin_host_version: hostVersion,
    environment
  }) => {
    const major = major_version || 0;
    const minor = minor_version || 0;
    const release = release_version || 0;
    const formattedHost =
      (host && hostVersion && ` (${host} ${hostVersion})`) || "";
    const build = (build_version && `-${build_version}`) || "";
    return {
      product,
      package: {
        id,
        version: `${major}.${minor}.${release}${build}${formattedHost}`,
        environment
      }
    };
  };

  const byProductAscending = (a, b) =>
    a.product === b.product ? 0 : a.product < b.product ? -1 : 1;

  const toProductPackagesMap = (software, { product, package: pkg }) => {
    software[product] = software[product] || { packages: [] };
    software[product].packages.push(pkg);
    return software;
  };

  const byVersionDescending = (a, b) =>
    a.version === b.version ? 0 : a.version > b.version ? -1 : 1;

  const exclusions = ({ product }) => !["houdini"].includes(product);

  const mappedPackages = software
    .map(softwarePackagesProjection)
    .filter(exclusions)
    .sort(byProductAscending)
    .reduce(toProductPackagesMap, {});

  Object.values(mappedPackages).forEach(({ packages }) => {
    packages.sort(byVersionDescending);
  });

  return mappedPackages;
};

export { softwarePackagesSuccess };

export default () => async dispatch => {
  const response = await axios.get(`${config.dashboardUrl}/api/v1/ee/packages`);

  const {
    data: { data }
  } = response;

  const packages = mapPackages(data);
  dispatch(softwarePackagesSuccess(packages));
};
