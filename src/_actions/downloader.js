import { createAction } from "redux-starter-kit";

export const toggleDrawer = createAction("downloader/toggleDrawer");

export const toggleUseDaemon = createAction("downloader/toggleUseDaemon");

export const downloadProgress = createAction("downloader/downloadProgress");

export const addFileToQueue = createAction("downloader/addFileToQueue");

export const startDownloadDaemon = createAction(
  "downloader/startDownloadDaemon"
);
