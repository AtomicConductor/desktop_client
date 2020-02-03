import DesktopClientError from "../errors/desktopClientError";
import DesktopClientErrorHandler from "../middleware/desktopClientErrorHandler";
import { createAction } from "@reduxjs/toolkit";
import { setNotification } from "./notification";
import { createRequestOptions } from "../_helpers/network";
import path from "upath";
import {
  exactFileExistsSync,
  ensureDirectoryReady,
  directoryExistsSync
} from "../_helpers/fileSystem";
import { DownloaderHelper } from "node-downloader-helper";
import config from "../config";
import { tokenSelector } from "../selectors/account";
import axios from "../_helpers/axios";
import { pushEvent } from "./log";
import PromiseQueue from "easy-promise-queue";

export const requestDownloadData = createAction(
  "downloader/requestDownloadData"
);
export const receiveDownloadData = createAction(
  "downloader/receiveDownloadData"
);
export const receiveExistingFilesInfo = createAction(
  "downloader/receiveExistingFilesInfo"
);
export const setFileExists = createAction("downloader/setFileExists");
//TODO: unit tests
//TODO: possibly convert synch ops into async

let downloadQueue = new PromiseQueue({ concurrency: 16 });

const downloadFileTask = (file, dispatch) => async () => {
  const { jobLabel, relativePath, url, fullPath, md5 } = file;
  const directory = path.dirname(fullPath);

  if (!ensureDirectoryReady(directory) || exactFileExistsSync(fullPath, md5))
    return;

  let startTime = new Date();
  await new DownloaderHelper(url, directory, {
    override: true,
    fileName: relativePath
  })
    .on("progress", stats => {
      const percentage = parseInt(stats.progress, 10);
      const currentTime = new Date();
      const elaspsedTime = currentTime - startTime;
      //dispatch only once per second
      if (elaspsedTime > 1000) {
        startTime = currentTime;
        dispatch(setFileExists({ jobLabel, relativePath, percentage }));
      }
    })
    .on("end", () => {
      dispatch(pushEvent(`downloaded ${relativePath}`, "info"));
      dispatch(setFileExists({ jobLabel, relativePath, percentage: 100 }));
    })
    .on("error", e => {
      DesktopClientErrorHandler(e);
      dispatch(setFileExists({ jobLabel, relativePath, percentage: -1 }));
    })
    .start();
};

export const addToQueue = jobLabel => async (dispatch, getState) => {
  const job = getState().entities.jobs[jobLabel];

  const { outputDirectory, files } = job;
  if (!ensureDirectoryReady(outputDirectory)) {
    throw new DesktopClientError(
      `Can't create or access directory: ${outputDirectory}`
    );
  }

  // TODO: should be part of normalizing response (i.e. map and sort)
  Object.values(files)
    .map(f => ({
      ...f,
      fullPath: path.join(outputDirectory, f.relativePath)
    }))
    .filter(f => !(f.exists && f.exists === 100))
    .sort((a, b) => (a.taskId > b.taskId ? 1 : -1))
    .forEach(file => {
      downloadQueue.add(
        downloadFileTask(
          {
            ...file,
            jobLabel
          },
          dispatch
        )
      );
    });
};

/**
 * Fetches a list of available download files for a job, and then updates the
 * list of files in the store.
 *

 * Also important to note that updateExistingFiles() determines the expanded
 * (visible) job by looking up the expandedJob entry in the store. This may not
 * necessarily be the same job we just fetched download information for. This is
 * a good thing, because if the user closed the panel while fetching, we don't
 * need to update its UI yet anyway. Any newly expanded job will have it's files
 * checked for existence instead.
 *
 * @export updateDownloadFiles
 * @param {string} jobLabel The job whose data to work on.
 * @returns Function that dispatches actions to start the fetch, fetch the data,
 * and update the entities in the store.
 */

//TODO: unit test
export const updateDownloadFiles = jobLabel => async (dispatch, getState) => {
  try {
    dispatch(requestDownloadData(jobLabel));

    const files = await fetchDownloadData(jobLabel, getState());

    await dispatch(receiveDownloadData({ files, jobLabel }));

    await dispatch(updateExistingFilesInfo());
  } catch (error) {
    dispatch(
      setNotification({
        type: "info",
        message: "Can't fetch download data for this job."
      })
    );
    dispatch(
      receiveDownloadData({
        jobLabel
      })
    );
  }
};

const fetchDownloadData = async (jobLabel, state) => {
  const options = createRequestOptions(tokenSelector(state));
  const { projectUrl } = config;
  const url = `${projectUrl}/downloads/${jobLabel}`;
  let response = await axios.get(url, options);
  const { data } = response;
  const downloads = data.downloads || [];
  const files = {};
  //TODO: mapping logic into a normalizer
  downloads.forEach(task => {
    return task.files.forEach(file => {
      const rp = file.relative_path;
      files[rp] = {
        relativePath: rp,
        md5: file.md5,
        url: file.url,
        taskId: file.task_id
      };
    });
  });
  return files;
};

export const updateExistingFilesInfo = () => async (dispatch, getState) => {
  const state = getState();

  const jobLabel = state.downloader.expandedJob;
  const job = state.entities.jobs[jobLabel];
  if (!job) return;

  const existing = [];

  const { outputDirectory, files } = job;

  if (directoryExistsSync(outputDirectory) && files) {
    Object.values(files).forEach(f => {
      const fullPath = path.join(outputDirectory, f.relativePath);
      const md5 = f.md5;
      if (exactFileExistsSync(fullPath, md5)) {
        existing.push(f.relativePath);
      }
    });
  }
  dispatch(receiveExistingFilesInfo({ jobLabel, existing }));
};
