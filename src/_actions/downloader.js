import { createAction } from "redux-starter-kit";

export const toggleDrawer = createAction("downloader/toggleDrawer");
export const toggleUseDaemon = createAction("downloader/toggleUseDaemon");
export const setJobInputValue = createAction("downloader/setJobInputValue");
export const setJobSuggestions = createAction("downloader/setJobSuggestions");
export const clearJobSuggestions = createAction(
    "downloader/clearJobSuggestions"
);
