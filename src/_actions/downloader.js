import { createAction } from "redux-starter-kit";

export const toggleDrawer = createAction("downloader/toggleDrawer");

export const toggleUseDaemon = createAction("downloader/toggleUseDaemon");

export const downloadProgress = createAction("downloader/downloadProgress");

export const addFileToQueue = createAction("downloader/addFileToQueue");

export const setFilterValue = createAction("downloader/setFilterValue");

export const setExpanded = createAction("downloader/setExpanded");
