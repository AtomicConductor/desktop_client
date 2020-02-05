import DesktopClientError from "../errors/desktopClientError";
import DesktopClientErrorHandler from "../middleware/desktopClientErrorHandler";
import { createAction } from "@reduxjs/toolkit";
import { createRequestOptions } from "../_helpers/network";
import path from "upath";
import {
  exactFileExists,
  ensureDirectoryReady,
  pathExists
} from "../_helpers/fileSystem";
import { DownloaderHelper } from "node-downloader-helper";
import config from "../config";
import { tokenSelector } from "../selectors/account";
import axios from "../_helpers/axios";
import PromiseQueue from "../_helpers/promiseQueue";

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

let downloadQueue = new PromiseQueue({ concurrency: 16 });

//TODO: unit tests
const downloadFileTask = (file, dispatch) => async () => {
  const { jobLabel, relativePath, url, outputDirectory, md5 } = file;
  const fullPath = path.join(outputDirectory, relativePath);
  const directory = path.dirname(fullPath);

  if (
    !(await ensureDirectoryReady(directory)) ||
    (await exactFileExists(fullPath, md5))
  )
    return;

  let startTime = new Date();
  await new DownloaderHelper(url, directory, {
    override: true,
    fileName: relativePath,
    retry: { maxRetries: 3, delay: 1000 }
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
  if (!(await ensureDirectoryReady(outputDirectory))) {
    throw new DesktopClientError(
      `Can't create or access directory: ${outputDirectory}`
    );
  }

  // TODO: Sorting should be part of normalizing response
  Object.values(files)
    .filter(f => !(f.exists && f.exists === 100))
    .sort((a, b) => (a.taskId > b.taskId ? 1 : -1))
    .forEach(file => {
      downloadQueue.add(
        downloadFileTask(
          {
            ...file,
            jobLabel,
            outputDirectory
          },
          dispatch
        )
      );
    });
};

//TODO: unit test
export const updateDownloadFiles = jobLabel => async (dispatch, getState) => {
  try {
    dispatch(requestDownloadData(jobLabel));

    const files = await fetchDownloadData(jobLabel, getState());

    await dispatch(receiveDownloadData({ files, jobLabel }));

    await dispatch(updateExistingFilesInfo());
  } catch (error) {
    dispatch(
      receiveDownloadData({
        jobLabel
      })
    );
    throw new DesktopClientError(
      "Can't fetch download data for this job.",
      error
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

  if (await pathExists(outputDirectory)) {
    for (const file in files) {
      const f = files[file];
      const fullPath = path.join(outputDirectory, f.relativePath);
      const md5 = f.md5;
      if (await exactFileExists(fullPath, md5)) {
        existing.push(f.relativePath);
      }
    }
  }
  dispatch(receiveExistingFilesInfo({ jobLabel, existing }));
};
