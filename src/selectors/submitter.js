import { createSelector } from "reselect";

const instanceTypesMap = state => state.entities.instanceTypes;

const instanceTypeIndex = state => state.submitter.instanceTypeIndex;

const instanceTypesSelector = createSelector(
  instanceTypesMap,
  instanceTypesMap =>
    Object.keys(instanceTypesMap)
      .map(_ => instanceTypesMap[_])
      .sort((a, b) => (a.cores < b.cores ? -1 : 1))
);

const instanceTypeDescriptionSelector = createSelector(
  instanceTypesSelector,
  instanceTypesSelector => instanceTypesSelector.map(_ => _.description)
);

const instanceTypeNamesSelector = createSelector(
  instanceTypesSelector,
  instanceTypesSelector => instanceTypesSelector.map(_ => _.name)
);

const selectedInstanceType = createSelector(
  [instanceTypeIndex, instanceTypesSelector],
  (instanceTypeIndex, instanceTypesSelector) =>
    instanceTypesSelector[instanceTypeIndex]
);

const assetsMap = state => state.submitter.assets;

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
  instanceTypeDescriptionSelector,
  instanceTypeNamesSelector,
  selectedInstanceType,
  assetsSelector
};
