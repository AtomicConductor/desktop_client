import { createSelector } from "reselect";

import { packageLocation } from "../_selectors/settings";

// const platform = os.platform();
const itemsSelector = state => state.plugins.items;
const installingSelector = state => state.plugins.installing;
const helpOpenSelector = state => state.plugins.helpOpen;

const pkgsArraySelector = createSelector(itemsSelector, itemsSelector =>
  Object.values(itemsSelector).sort((a, b) => (a.order < b.order ? -1 : 1))
);

const pkgNamesArraySelector = createSelector(
  pkgsArraySelector,
  pkgsArraySelector => pkgsArraySelector.map(_ => _.name)
);

const packageNameSelector = createSelector(
  installingSelector,
  itemsSelector,
  (installingSelector, itemsSelector) =>
    installingSelector in itemsSelector &&
    Boolean(itemsSelector[installingSelector].available) &&
    itemsSelector[installingSelector].packageName
);

const helpItemSelector = createSelector(
  helpOpenSelector,
  itemsSelector,
  packageLocation,
  (helpOpenSelector, itemsSelector, packageLocation) => {
    if (!(helpOpenSelector in itemsSelector)) {
      return null;
    }
    return { ...itemsSelector[helpOpenSelector], packageLocation };
  }
);

export {
  itemsSelector,
  installingSelector,
  pkgsArraySelector,
  pkgNamesArraySelector,
  packageNameSelector,
  helpOpenSelector,
  helpItemSelector
};
