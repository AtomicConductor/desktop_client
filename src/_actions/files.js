import { createAction } from "redux-starter-kit";
import { setNotification } from "./notification";
import { createRequestOptions } from "../_helpers/network";
import path from "upath";
import fs from "fs";
import md5File from "md5-file";
import { checkResponse } from "../_helpers/network";
import {
  exactFileExistsSync,
  ensureDirectoryReadyFor
} from "../_helpers/fileSystem";

import { DownloaderHelper } from "node-downloader-helper";

import { receiveDownloadSummary, updateExistingFilesInfo } from "./jobs";

export const updateFileDownloaded = createAction(
  "downloader/updateFileDownloaded"
);

const Queue = require("better-queue");
const MemoryStore = require("better-queue-memory");

// const ensureDirectoryReadyFor = file => {
//   const directory = path.dirname(file.fullPath);
//   try {
//     fs.accessSync(directory, fs.constants.W_OK);
//     return true;
//   } catch (err) {
//     fs.mkdirSync(directory, { recursive: true });
//     try {
//       fs.accessSync(directory, fs.constants.W_OK);
//       return true;
//     } catch (err) {
//       return false;
//     }
//   }
// };

const canAndShouldDownload = (file, callback) => {
  if (exactFileExistsSync(file.fullPath, file.md5)) {
    return callback("file already exists");
  }
  if (!ensureDirectoryReadyFor(file.fullPath)) {
    return callback("cant write to directory");
  }
  return callback(null, file);
};

/**
 * QUEUE OPTIONS
 * In the NW.js environment we must provide a setImmediate
 * function because otherwise it borks out because setImmediate
 * is not universally supported.
 *
 * We also have to provide the store to be used - only on NW.js.
 *
 * We provide a merge function that returns nothing because
 * it is run when a duplicate task is in the queue. The idea
 * is it returns a merged version of the 2 tasks when there'
 * s a clash. Since we on't want to run anything in this case,
 * we return no task.
 *
 * The merge function uses the "id" property  to identify
 * duplicate tasks, so we have to map the fullPath to id.
 * */

const downloaderOptions = { override: true };

const queueOptions = {
  concurrent: 2,
  setImmediate: fn => {
    setTimeout(fn, 0);
  },
  id: "fullPath",
  merge: function() {},
  filter: canAndShouldDownload,
  store: new MemoryStore()
};

const rename = file => {
  const existingPath = path.join(
    path.dirname(file.fullPath),
    path.basename(file.url.split("?")[0])
  );
  console.log(existingPath + " --- " + file.fullPath);
  fs.renameSync(existingPath, file.fullPath);
};

/** Make the Download queue in a thunk */
let TheDownloadQueue = null;
export const startDownloadQueue = () => {
  return (dispatch, getState) => {
    TheDownloadQueue = new Queue(function(file, onDone) {
      // console.log(file.url);
      const directory = path.dirname(file.fullPath);

      const dh = new DownloaderHelper(file.url, directory, downloaderOptions);

      dh.on("end", () => {
        rename(file);

        // dispatch(updateExists(file))
        // const msg = `Download Completed !!!!!!!!`;
        // console.log(msg);
        onDone();
      });

      dh.on("progress", stats => {
        // dispatch(downloadProgress(stats));
        // console.log(stats);
      });

      dh.on("error", error => {
        console.log(error);
        onDone();
        // dispatch(setNotification({ snackbar: error.message, type: "error" }));
      });

      dh.start();
    }, queueOptions);

    // dispatch(
    //   setNotification({ snackbar: "Started download queue", type: "success" })
    // );
    console.log("Started download queue");
  };
};

// const downloadComplete = (jobLabel, file) => {
//   dispatch(updateFileDownloaded({ jobLabel, file }));
// }

/** Thunk that wraps the fetch and download operations */
export function addToQueue(jobLabel) {
  return async function(dispatch, getState) {
    //   dispatch(requestDownloadData()); - spinner possibly?
    try {
      const data = await fetchDownloadData(jobLabel, getState());

      // add the summary data to the redux store
      // and flag the entries for which files already exist
      const summaryData = extractSummaryFileData(jobLabel, data);
      dispatch(receiveDownloadSummary(summaryData));
      dispatch(updateExistingFilesInfo({ jobLabel }));

      console.log(data);
      data.forEach(file => {
        TheDownloadQueue.push(file, () => {
          dispatch(updateFileDownloaded({ jobLabel, file }));
          // console.log("DONE:" + file.md5);
        });
      });

      //   dispatch(receiveJobs(data));
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

async function fetchDownloadData(jobLabel, state) {
  // options is just headers, content type etc.
  const options = createRequestOptions(state);
  const { projectUrl } = state.environment.project;
  const url = `${projectUrl}/downloads/${jobLabel}`;
  let response = await fetch(url, options);
  checkResponse(response);
  const data = await response.json();
  const { outputDirectory } = state.entities.jobs[jobLabel];

  // We use the full pathname for the ID, which is used by the
  // queue to ignore duplicates.
  // Duplicates could happen if the user clicks the download
  // button twice really fast

  return data.downloads
    .flatMap(task =>
      task.files.map(file => ({
        relativePath: file["relative_path"],
        md5: file["md5"],
        url: file["url"],
        taskId: file["task_id"],
        fullPath: path.join(outputDirectory, file["relative_path"]),
        outputDirectory,
        jobLabel
      }))
    )
    .sort((a, b) => (a["taskId"] > b["taskId"] ? 1 : -1));
}

const extractSummaryFileData = (jobLabel, data) => {
  let outputDirectory = null;
  let first = true;
  const files = {};

  data.forEach(file => {
    if (first) {
      outputDirectory = file["outputDirectory"];
      first = false;
    }
    const rp = file["relativePath"];

    files[rp] = {
      relativePath: rp,
      md5: file["md5"]
    };
  });
  return { files, jobLabel, outputDirectory };
};

// export const addFilesToQueue = jobLabel => {
//   return (dispatch, getState) => {
//     console.log("HERE addResourcesToQueue !!!! ");
//     const downloadables = getState().entities.downloads;
//     // add files by md5 or jobs by label.
//     let keys = params;
//     if (!Array.isArray(params)) {
//       keys = [params];
//     }
//     // console.log(keys);
//     keys.forEach(key => {
//       if (key.match(/^\d{5}$/)) {
//         // its a jobId
//         // console.log(`its a jobId ${Object.entries(downloadables).length}`);

//         // let arr = Object.entries(downloadables).filter(
//         //   dl => dl[1]["job_id"] === key
//         // );
//         // console.log(arr);

//         Object.entries(downloadables)
//           .filter(dl => dl[1]["job_id"] === key)
//           .map(dl => dl[1])
//           .sort((a, b) => (a["task_id"] > b["task_id"] ? 1 : -1))
//           .forEach(dl => {
//             console.log(dl.url);
//             // console.log(dl["task_id"]);
//             TheDownloadQueue.push(dl, () => {
//               console.log("DONE:" + dl.url);
//             });
//             // dispatch(addFileToQueue(dl));
//           });
//       } else {
//         // its an md5
//         TheDownloadQueue.push(downloadables[key], () => {
//           console.log("DONE:" + downloadables[key].url);
//         });
//         // dispatch(addFileToQueue(downloadables[key]));
//       }
//     });
//   };
// };
