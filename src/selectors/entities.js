import { createSelector } from "reselect";

const instanceTypesMapSelector = state => state.entities.instanceTypes;

const instanceTypesSelector = createSelector(
  instanceTypesMapSelector,
  instanceTypesMap =>
    Object.keys(instanceTypesMap)
      .map(_ => instanceTypesMap[_])
      .sort((a, b) => (a.cores < b.cores ? -1 : 1))
);

const projectsSelector = state =>
  state.entities.projects
    .concat()
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

const presetsSelector = state => state.entities.presets;
const selectedPresetSelector = createSelector(
  presetsSelector,
  presets => {
    // eslint-disable-next-line no-unused-vars
    for (const key in presets) {
      if (presets[key].selected) {
        return { key, ...presets[key] };
      }
    }

    return undefined;
  }
);

export {
  instanceTypesSelector,
  instanceTypesMapSelector,
  projectsSelector,
  presetsSelector,
  selectedPresetSelector
};
