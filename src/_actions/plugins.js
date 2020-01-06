import { createAction } from "redux-starter-kit";

export const setInstallPathValue = createAction("plugins/setInstallPathValue");
export const resetInstallPathValue = createAction(
  "plugins/resetInstallPathValue"
);
export const installPlugin = createAction("plugins/installPlugin");
export const uninstallPlugin = createAction("plugins/uninstallPlugin");

//TODO: remove all plugins related code
