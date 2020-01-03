/*
  The purpose of functions in this file, is to start a queue and add downloads to
  it. It uses better-queue and node-downloader-helper respectively.
  https://www.npmjs.com/package/better-queue
  https://www.npmjs.com/package/node-downloader-helper
*/
import DesktopClientError from "../errors/desktopClientError";

import { createAction } from "@reduxjs/toolkit";
import { setNotification } from "./notification";
import { createRequestOptions } from "../_helpers/network";
import path from "upath";

import fs from "fs";
import {
  exactFileExistsSync,
  ensureDirectoryReady,
  directoryExistsSync
} from "../_helpers/fileSystem";

import { DownloaderHelper } from "node-downloader-helper";

import config from "../config";

import { tokenSelector } from "../selectors/account";
import axios from "../_helpers/axios";
import { pushEvent } from "../_actions/log";
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

const Queue = require("better-queue");
const MemoryStore = require("better-queue-memory");

//TODO: unit tests
//TODO: possibly convert synch ops into async

/**
 * Renames the file from the object-storage name to the original name.
 *
 * The rename is synchronous because we don't want the object to leave
 * the queue until renaming is complete. It would break the logic
 * of the canAndShouldDownload check. There would be a small moment where
 * a file could leave the queue but not be renamed, thereby causing another
 * download of the same file. Admittedly, unlikely to ever happen.
 *
 * @param {object} file
 */
const rename = file => {
  const existingPath = path.join(
    path.dirname(file.fullPath),
    path.basename(file.url.split("?")[0])
  );
  fs.renameSync(existingPath, file.fullPath);
};

/**
 * Determine if this file is to be downloded. This function is given as a filter
 * while adding files to the queue and is responsible for only adding files that
 * should be downloaded.
 *
 * If the file already exists, we don't want to add it. And if we can't prepare
 * a directory, then we dont want to add it either.
 *
 * @param {*} file The object representing a file that may be added to the queue.
 * @param {*} callback A callback to run with an error message or the file.
 * @returns The result of the callback.
 */
const canAndShouldDownload = (file, callback) => {
  if (exactFileExistsSync(file.fullPath, file.md5)) {
    return callback("file already exists");
  }
  if (!ensureDirectoryReady(path.dirname(file.fullPath))) {
    return callback("cant write to directory");
  }
  return callback(null, file);
};

/**
 * Queue options object.
 * https://www.npmjs.com/package/better-queue
 *
 * 1. In the NW.js environment we must provide a setImmediate() polyfill.
 *
 * 2. In the NW.js environment we also have to provide the in-memory store for
 *    the queue. In a future version we could use the redux store maybe.
 *
 * 3. The merge function is designed for merging 2 tasks when one is already
 *    in the queue. We provide a merge function that returns nothing because
 *    if a task is already in the queue then we don't want to add it again.
 *
 * 4. The merge function uses the "id" property  to identify duplicate tasks,
 *    so we map the fullPath to the id.
 *
 * 5. The filter canAndShouldDownload avoids placing existing files on the queue.
 *
 * 6. maxRetries means a task does not leave the queue and produce an error
 *    until it has failed (maxRetries+1) times.
 * */
const queueOptions = {
  concurrent: 16,
  setImmediate: fn => {
    setTimeout(fn, 0);
  },
  id: "fullPath",
  merge: function() {},
  filter: canAndShouldDownload,
  store: new MemoryStore(),
  maxRetries: 3
};

// Override is true because the name may be the same but the content changed.
const downloaderOptions = { override: true };

let TheDownloadQueue = null;

export const startDownloadQueue = () => {
  return (dispatch, getState) => {
    TheDownloadQueue = new Queue(function(file, onDone) {
      const directory = path.dirname(file.fullPath);

      const { jobLabel, relativePath, url } = file;

      /*
      uncomment next 2 lines to simulate failures caused by a bad URL
      const rn = Math.random();
      const url = rn > 0.3 ? "junk" : file.url;
      */

      const dh = new DownloaderHelper(url, directory, downloaderOptions);

      /*
      Implement progress updates for individual files.
      This is useful for large slow files. Progress stats are emitted once a
      second, so files that take less than a second to download will never
      trigger the event.
      */
      dh.on("progress", stats => {
        const percentage = parseInt(stats.progress, 10);
        dispatch(setFileExists({ jobLabel, relativePath, percentage }));
      });

      /*
      The downloader emits an "end" event when a file has been successfully
      downloaded. We must also rename the file before letting the queue know the
      task has finished. This is because, when adding files to the queue, a
      check is made: exactFileExistsSync() to see if the file exists already or
      is in the queue. It checks filename and md5. If the file hasn't been
      renamed before it leaves the queue, then it can be in a state where the
      queue thinks it doesn't exist and will redownload it.
      */
      dh.on("end", () => {
        rename(file);
        onDone(null, file);
      });

      /*
        We must propagate the error via the queue's onDone callback in order to
        notify the queue, so that it can decide whether to retry the download,
        or give up.
      */
      dh.on("error", error => {
        onDone(error);
      });

      dh.start();
    }, queueOptions);
    dispatch(pushEvent("Download queue initialized", "info"));
  };
};

/*
 * Thunk that adds all available file objects for a job to the download queue.
 *
 *
 * @export
 * @param {string} jobLabel Example 00452
 * @returns function
 */
export function addToQueue(jobLabel) {
  return async function(dispatch, getState) {
    const job = getState().entities.jobs[jobLabel];

    // OutputDirectory must exist or be created.
    const { outputDirectory, files } = job;
    if (!ensureDirectoryReady(outputDirectory)) {
      throw new DesktopClientError(
        `Can't create or access directory: ${outputDirectory}`
      );
    }

    /*
      TODO Here would be a good place to check disk space. Especially useful when
      downloading directly to a thumb drive or something.
      */

    Object.values(files)
      .filter(f => !(f.exists && f.exists === 100))
      .sort((a, b) => (a.taskId > b.taskId ? 1 : -1))
      .forEach((file, i) => {
        const { relativePath } = file;

        /*
          The object we add to the download queue needs to contain the fullPath
          and the jobLabel so that it knows where to save and what object to
          update in the redux store. We add them here, on the fly, in order to
          keep the store DRY. i.e. The file entries shouldn't need to store
          stuff that the job already stores.
          */
        const fileDownload = {
          ...file,
          jobLabel,
          fullPath: path.join(outputDirectory, relativePath)
        };
        TheDownloadQueue.push(fileDownload, (err, result) => {})
          .on("finish", function(result) {
            dispatch(
              setFileExists({ jobLabel, relativePath, percentage: 100 })
            );
          })
          .on("failed", function(err) {
            dispatch(setFileExists({ jobLabel, relativePath, percentage: -1 }));
          });
      });
  };
}

/**
 * Fetches a list of available download files for a job, and then updates the
 * list of files in the store.
 *
 * Afterwards, we find out which of those entries represent files that already
 * exist, and update their exist state. This happens in a setTimeout(0) because
 * otherwise the UI is not updated beforehand, and then we don't see the
 * progress bar update.
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

//TODO: use arrow functions instead of function keyword
//TODO: unit test
export function updateDownloadFiles(jobLabel) {
  return async function(dispatch, getState) {
    try {
      dispatch(requestDownloadData(jobLabel));

      const files = await fetchDownloadData(jobLabel, getState());

      dispatch(receiveDownloadData({ files, jobLabel }));

      //TODO: use await instead of setTimeout
      setTimeout(function() {
        dispatch(updateExistingFilesInfo());
      }, 0);
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
}

/**
 *
 *
 * @param {string} jobLabel The job to get the list of files for.
 * @param {redux} state
 * @returns Object containing available files for download. The object keys are
 * the files' relative paths.
 */
async function fetchDownloadData(jobLabel, state) {
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
}

/**
 * Update the store with info about which of the file entries actually exist on
 * disk for the currently expanded job.
 *
 * Before starting, we turn off the watcher. And after we have updated them, we
 * restart the watcher. Not sure if this is bnecessary, but it seems to be
 * cleaner.
 *
 * @export updateExistingFilesInfo
 * @returns function that dispatches an action to update the store about which
 * files exist on disk.
 */
export function updateExistingFilesInfo() {
  return async function(dispatch, getState) {
    const state = getState();

    const jobLabel = state.downloader.expandedJob;
    if (!(jobLabel in state.entities.jobs)) {
      return;
    }
    const job = state.entities.jobs[jobLabel];

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
}
