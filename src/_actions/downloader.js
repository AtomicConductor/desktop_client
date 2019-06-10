import { createAction } from "redux-starter-kit";

export const toggleDrawer = createAction("downloader/toggleDrawer");
export const toggleUseDaemon = createAction("downloader/toggleUseDaemon");
export const setJobValue = createAction("downloader/setJobValue");
export const setJobSuggestions = createAction("downloader/setJobSuggestions");
export const clearJobSuggestions = createAction(
  "downloader/clearJobSuggestions"
);
export const setTaskValue = createAction("downloader/setTaskValue");
export const setOutputPathValue = createAction("downloader/setOutputPathValue");
