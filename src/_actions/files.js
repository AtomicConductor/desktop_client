/*



*/

import { createAction } from "redux-starter-kit";
import { setNotification } from "./notification";
import { createRequestOptions } from "../_helpers/network";
import path from "upath";
import fs from "fs";
import { checkResponse } from "../_helpers/network";
import {
  exactFileExistsSync,
  ensureDirectoryReady,
  directoryExistsSync
} from "../_helpers/fileSystem";

import { DownloaderHelper } from "node-downloader-helper";

import config from "../config";

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

/**
 * Renames the file from the object-storage name to the intended name.
 *
 * The rename is synchronous because we don't want the object to leave
 * the queue until renaming is complete, because it would break the logic
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
 * Determines if its possible for this file to be downloded.
 * This function is given as a filter while adding files to the queue
 * and is responsible for only adding files that shold be downloaded.
 *
 * If the file already exists, we don't want to add it. And if we can't
 * prepare a directory, then we dont wat to add it either.
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
 * 1. In the NW.js environment we must provide a setImmediate()
 * polyfill.
 *
 * 2. In the NW.js environment we also have to provide the in-memory store.
 * In a future version we could use the redux store maybe.
 *
 * 3. The merge function is designed for merging 2 tasks when one is already
 * in the queue. We provide a merge function that returns nothing because
 * if a task is already in the queue then we don't want to add it again.
 *
 * 4. The merge function uses the "id" property  to identify duplicate tasks,
 * so we map the fullPath to the id.
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

      const file_url = file.url;

      /*
      uncomment next 2 lines to simulate failures caused by a bad URL
      const rn = Math.random();
      const file_url = rn > 0.3 ? "junk" : file.url;
      */

      const dh = new DownloaderHelper(file_url, directory, downloaderOptions);
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

      // Implement progress for individual files when we have some huge files to work with.
      // dh.on("progress", stats => {});

      /*
        We must propagate the error via the queue's onDone callback in order to
        notify the queue, so that it can decide whether to retry the download,
        or give up.
      */
      dh.on("error", error => {
        onDone(error, file);
      });

      dh.start();
    }, queueOptions);
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
    try {
      // OutputDirectory must exist or be created.
      const job = getState().entities.jobs[jobLabel];
      const { outputDirectory, files } = job;
      if (!ensureDirectoryReady(outputDirectory)) {
        throw new Error(`Can't create or access directory: ${outputDirectory}`);
      }
      Object.values(files)
        .sort((a, b) => (a["taskId"] > b["taskId"] ? 1 : -1))
        .forEach((file, i) => {
          const { relativePath } = file;
          TheDownloadQueue.push(file, (err, result) => {})
            .on("finish", function(result) {
              dispatch(
                setFileExists({ jobLabel, relativePath, percentage: 100 })
              );
            })
            .on("failed", function(err) {
              dispatch(
                setFileExists({ jobLabel, relativePath, percentage: -1 })
              );
            });
        });
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          snackbar: error.message
        })
      );
    }
  };
}

/**
 *
 *
 * @export
 * @param {string} jobLabel The job whose data to work on.
 * @returns Function that dispatches actions to start the fetch, fetch the data,
 * and update the entities in the store.
 */
export function updateDownloadFiles(jobLabel) {
  return async function(dispatch, getState) {
    try {
      dispatch(requestDownloadData(jobLabel));

      const files = await fetchDownloadData(jobLabel, getState());

      dispatch(receiveDownloadData({ files, jobLabel }));

      // After receiving the list of available downloads, we want to update the
      // information about which files already exist. We put this in a
      // setTimeout because otherwise the UI is not updated before it happens.
      setTimeout(function() {
        dispatch(updateExistingFilesInfo(jobLabel));
      }, 0);
    } catch (error) {
      dispatch(
        setNotification({
          type: "info",
          snackbar: "Can't fetch download data for this job."
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
  const options = createRequestOptions(state);
  const { projectUrl } = config;
  const url = `${projectUrl}/downloads/${jobLabel}`;
  let response = await fetch(url, options);
  checkResponse(response);
  const data = await response.json();
  const { outputDirectory } = state.entities.jobs[jobLabel];

  // Duplicates could happen if the user clicks the download button twice really
  // fast, so we provide a pathname for the ID so thhey can be ignored. It must
  // be the _full_ pathname, because files from other jobs could be in the queue
  // at the same time and they could have the same relative path.
  const downloads = data.downloads || [];
  const files = {};
  downloads.forEach(task => {
    return task.files.forEach(file => {
      const rp = file["relative_path"];
      files[rp] = {
        relativePath: rp,
        md5: file["md5"],
        url: file["url"],
        taskId: file["task_id"],
        fullPath: path.join(outputDirectory, file["relative_path"]),
        outputDirectory,
        jobLabel
      };
    });
  });
  return files;
}

/**
 *
 *
 * @export
 * @param {string} jobLabel Job whose files will be checked for existence.
 * @returns function that dispatches an action to update the store about which
 * files exist on disk.
 */
export function updateExistingFilesInfo(jobLabel) {
  return async function(dispatch, getState) {
    const state = getState();
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
