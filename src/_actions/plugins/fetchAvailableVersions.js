import { createAction } from "@reduxjs/toolkit";
import { pkgsArraySelector } from "../../_selectors/plugins";
import config from "../../config";
import axios from "../../_helpers/axios";

const receivePyPiVersions = createAction("plugins/receivePyPiVersions");

const normalizeVersions = (name, data) => {
  const payload = {
    name,
    packageName: data.info.name,
    versions: []
  };

  for (const version in data.releases) {
    const wheel = data.releases[version].find(
      vr => vr.packagetype === "bdist_wheel"
    );
    if (wheel) {
      payload.versions.push({ version, time: wheel.upload_time });
    }
  }

  payload.versions = payload.versions
    .sort(function(a, b) {
      return b.time.localeCompare(a.time);
    })
    .map(el => el.version);

  return payload;
};

export default () => async (dispatch, getState) => {
  const state = getState();
  const allPackages = pkgsArraySelector(state);

  await Promise.all(
    allPackages
      .filter(pkg => pkg.available === "pip")
      .map(pkg =>
        axios
          .get(`${config.pypi}/pypi/${pkg.packageName}/json`)
          .then(response => {
            if (response.status === 200) {
              const normalized = normalizeVersions(pkg.name, response.data);
              dispatch(receivePyPiVersions(normalized));
            }
          })
          .catch(err => {
            console.log(`${pkg.name} ${err.message}`);
          })
      )
  );
};

export { receivePyPiVersions };
