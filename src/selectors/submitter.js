import { createSelector } from "reselect";

const instanceTypesMapSelector = state => state.entities.instanceTypes;

const projectsSelector = state =>
  state.entities.projects
    .concat()
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

const instanceTypesSelector = createSelector(
  instanceTypesMapSelector,
  instanceTypesMap =>
    Object.keys(instanceTypesMap)
      .map(_ => instanceTypesMap[_])
      .sort((a, b) => (a.cores < b.cores ? -1 : 1))
);

const assetsMap = state => state.submitter.submission.assets;

const assetsSelector = createSelector(
  assetsMap,
  assetsMap =>
    Object.keys(assetsMap).map((_, i) => ({
      path: _,
      size: assetsMap[_].size,
      type: assetsMap[_].type
    }))
);

export {
  instanceTypesSelector,
  instanceTypesMapSelector,
  assetsSelector,
  projectsSelector
};
