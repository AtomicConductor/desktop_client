import { promisify } from "util";

import fs, { promises as fsp } from "fs";

import { createAction } from "redux-starter-kit";
// import { PythonShell as ps } from "python-shell";

import { setNotification } from "../_actions/notification";
import { setPythonScriptResponse, pythonScriptFailure } from "./python";

import { DownloaderHelper } from "node-downloader-helper";

const Queue = require("better-queue");

const MemoryStore = require("better-queue-memory");

export const toggleDrawer = createAction("downloader/toggleDrawer");

export const toggleUseDaemon = createAction("downloader/toggleUseDaemon");

export const downloadProgress = createAction("downloader/downloadProgress");

export const addFileToQueue = createAction("downloader/addFileToQueue");

export const startDownloadDaemon = createAction(
  "downloader/startDownloadDaemon"
);

const options = {
  concurrent: 4,
  setImmediate: fn => {
    setTimeout(fn, 0);
  },
  store: new MemoryStore()
};

let qqq = null;
export const startDownloadQueue = params => {
  return (dispatch, getState) => {
    qqq = new Queue(function(file, callback) {
      // console.log(file.url);
      const dl = new DownloaderHelper(
        file.url,
        "/Users/julian/Downloads/cnw_temp"
      )
        .on("end", () => {
          const msg = `Download Completed`;
          console.log(msg);
          callback();
        })
        .on("progress", stats => {
          // dispatch(downloadProgress(stats));
          console.log(stats);
        })
        .on("error", error => {
          console.log(error);
          callback();
          // dispatch(setNotification({ snackbar: error.message, type: "error" }));
        })
        .start();
    }, options);
    dispatch(
      setNotification({ snackbar: "Started download queue", type: "success" })
    );
    console.log("Started download queue");
  };
};

// export function downloadAFile() {
//   return (dispatch, getState) => {
//     const state = getState();

//     if (!state.downloader.queue) {
//       dispatch(
//         setNotification({ snackbar: "Nothing to download", type: "warning" })
//       );
//       return;
//     }

//     const file = state.downloader.queue[0];

//     qqq.push(file);
//   };
// }

const test_options = {
  concurrent: 3,
  setImmediate: fn => {
    setTimeout(fn, 0);
  },
  store: new MemoryStore()
};

let test_qqq = null;
export const startDownloadQueueTest = params => {
  return (dispatch, getState) => {
    test_qqq = new Queue(function(file, callback) {
      // console.log(file.url);

      console.log("!!!:" + file.relative_path);
      callback();
    }, options);

    console.log("Started TEST queue");
  };
};

export const addResourcesToQueue = params => {
  return (dispatch, getState) => {
    console.log("HERE addResourcesToQueue !!!! ");
    const downloadables = getState().entities.downloads;
    // add files by md5 or jobs by label.
    let keys = params;
    if (!Array.isArray(params)) {
      keys = [params];
    }
    // console.log(keys);
    keys.forEach(key => {
      if (key.match(/^\d{5}$/)) {
        // its a jobId
        // console.log(`its a jobId ${Object.entries(downloadables).length}`);

        // let arr = Object.entries(downloadables).filter(
        //   dl => dl[1]["job_id"] === key
        // );
        // console.log(arr);

        Object.entries(downloadables)
          .filter(dl => dl[1]["job_id"] === key)
          .map(dl => dl[1])
          .sort((a, b) => (a["task_id"] > b["task_id"] ? 1 : -1))
          .forEach(dl => {
            console.log(dl.url);
            // console.log(dl["task_id"]);
            qqq.push(dl, () => {
              console.log("DONE:" + dl.url);
            });
            // dispatch(addFileToQueue(dl));
          });
      } else {
        // its an md5
        qqq.push(downloadables[key], () => {
          console.log("DONE:" + downloadables[key].url);
        });
        // dispatch(addFileToQueue(downloadables[key]));
      }
    });
  };
};

// export const setJobValue = createAction("downloader/setJobValue");
// export const setJobSuggestions = createAction("downloader/setJobSuggestions");
// export const clearJobSuggestions = createAction(
//   "downloader/clearJobSuggestions"
// );

// export const setTaskValue = createAction("downloader/setTaskValue");
// export const setTaskSuggestions = createAction("downloader/setTaskSuggestions");
// export const clearTaskSuggestions = createAction(
//   "downloader/clearTaskSuggestions"
// );

// export const setOutputPathValue = createAction("downloader/setOutputPathValue");

// export const runDownloadJobs = createAction("downloader/runDownloadJobs");

// const initializeQueue = params => {
//   return (dispatch, getState) => {
//     Q = new Queue(function(file, cb) {
//       // Some processing here ...

//       const dl = new DownloaderHelper(
//         file.url,
//         "/Users/julian/Downloads/cnw_temp"
//       );

//       // cb(null, result);
//     });
//   };
// };

// const setImm =  fn => {
//   setTimeout(fn,0)
// }
// setImmediate(() => {
//   i18n.off('initialized', initialized);
// });
// setTimeout(() => {
//   i18n.off('initialized', initialized);
// }, 0);

// const cb = dl => {
//   dl.on("end", () => {
//     const msg = `Download Completed`;
//     console.log(msg);
//   });

//   dl.on("progress", stats => {
//     // dispatch(downloadProgress(stats));
//     console.log(stats);
//   });

//   dl.on("error", error => {
//     console.log(error);
//     // dispatch(setNotification({ snackbar: error.message, type: "error" }));
//   });

//   dl.start();
// };

// export function runDownloadJobs() {
//   return (dispatch, getState) => {
//     const state = getState();
//     const url =
//       "https://www.conductortech.com/img/logo/conductorTech_logoMark_white_80p.svg";
//     chrome.downloads.download(
//       {
//         url,
//         method: "GET",
//         filename: "foo.svg",
//         saveAs: false,
//         conflictAction: "overwrite"
//       },
//       downloadId => {
//         return dispatch(
//           setPythonScriptResponse(`runDownloadJobs  ${downloadId}`)
//         );
//         // this.downloadId = downloadId;
//       }
//     );
//   };
// }
// "http://bit.ly/2mTM3nY"
// https://upload.wikimedia.org/wikipedia/commons/c/cc/ESC_large_ISS022_ISS022-E-11387-edit_01.JPG
//const img_url =
//  "https://images.unsplash.com/photo-1560336767-cce3c1974325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1834&q=80";

// const img_url =
//   "https://upload.wikimedia.org/wikipedia/commons/c/cc/ESC_large_ISS022_ISS022-E-11387-edit_01.JPG";

// const img_url = "http://ipv4.download.thinkbroadband.com/1GB.zip";
// const medium_file_url = "http://ipv4.download.thinkbroadband.com/200MB.zip";
// const large_img =
//   "https://upload.wikimedia.org/wikipedia/commons/e/e3/Large_and_small_magellanic_cloud_from_new_zealand.jpg";

// const cimg_url =
//   "https://storage.googleapis.com/eloquent-vector-104019/accounts/5175325533143040/hashstore/f36f77b05499993b9afbe1063eeea101?Expires=1563033082&GoogleAccessId=eloquent-vector-104019%40appspot.gserviceaccount.com&Signature=BnIYzUwlZ04tk5HRfxq1Fp0%2FpNmRlB567k2OWsXhpIcFifzrnxhkjHxud4VmprJeJGthroi81W2jcnPz3t%2Fe1%2FGWTFF0k93edGYMlAGfbF%2FdC3ZyQ%2FdUBqQJlQedwR8LzKVt83ebtHQAolqAcIKP04HfLczXYcoltQZqyU7EvQUATaFj7iUeJFeUWoK6PDT%2F%2FF4vEYb7oNjqbPghayZxgmtEG85eigdcAePjp3%2BkQPImyjk%2F9XSSih57QNRNHG0r1gSPBOpyJ%2BjKmM4s8zhSLugfdS4SqTqQ43APvEC8lvjjvB2ExyL%2B18LwKckiaPOEHAXBKexDXG%2BX0T38oVqWeQ%3D%3D";

//www.googleapis.com/storage/v1/b/[BUCKET_NAME]/o/[OBJECT_NAME]?alt=media

// const  headers: {
// https: //     'Content-Type': 'application/json',
//     'Authorization': u'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijo1MTc1MzI1NTMzMTQzMDQwLCJyb2xlIjowLCJzdWIiOiI1NzE2Mzg3NTI3OTE3NTY4IiwiZXhwIjoxNTYwNTI2NDgxLCJzY29wZSI6InVzZXIiLCJpc3MiOiJodHRwczovL2lkLmRldi1jb25kdWN0b3J0ZWNoLmNvbSIsImlhdCI6MTU2MDQzOTMwMywiaWQiOjU3MTYzODc1Mjc5MTc1NjgsImVtYWlsIjoianVsaWFuLm1hbm5AYWRtaW9zLXNhLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmRldi1jb25kdWN0b3J0ZWNoLmNvbSJ9.E3uqgN49MZThx0U4oSuuZXM0Rl-x0Spwucu1Vh3eXfy_RLxpXp71y-L3KAM38ExAyD394i8Tb2VpZcjA-B7DwDzY5zhkz-3assepIVoGDeAEtsqvyvfMXFg9tdvjpFs70n7iuDe0uQz3cwyKhNCftpzDMBt96jLNsApW1P8VMP2wjoDJf3kI57cjtXsXLEsIqmIRz0lO3iWIdKrS_B4rXQLItoK2dPJXmCm5-Yan_uHbTSEcwI0OiAbSMRcRAP6F_AAiZm4fUFKUwDRc78ZGmKK8PrdVtQCa3gySR27x5NrNw2aqu5AEgS6Youjc0WWmE_p_8ce4rnJ1DvHT8uZQYA',
//     'Accept': 'application/json'
//   }

//   {
//     method: 'GET', // Request Method Verb
//     headers: {},  // Custom HTTP Header ex:  '', // Custom filename when saved
//     forceResuAuthorization, User-Agent
//     fileName:me: false // If the server does not return the "accept-ranges" header, can be force if it does support it
//     override: false, // if true it will override the file, otherwise will append '(number)' to the end of file
//     httpRequestOptions: {}, // Override the http request options
//     httpsRequestOptions: {}, // Override the https request options, ex: to add SSL Certs
// }

// const dl = new DownloaderHelper(
//   "http://ipv4.download.thinkbroadband.com/1GB.zip",
//   __dirname
// );

// dl.on("end", () => console.log("Download Completed"));
// dl.start();

// export function runDownloadJobs() {
//   return (dispatch, getState) => {
//     const state = getState();

//     axios.get(img_url, {
//       onDownloadProgress: event => {
//         const res = `${event.loaded} --- ${event.total}`;
//         console.log(res);
//         dispatch(downloadProgress(res));
//       }
//     });

//     // axios({
//     //   method: "get",
//     //   url: "http://bit.ly/2mTM3nY",
//     //   responseType: "stream",
//     //   onDownloadProgress: function(progressEvent) {
//     //     console.log(progressEvent);
//     //     dispatch(downloadProgress(progressEvent));
//     //   }
//     // }).then(function(response) {
//     //   response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"));
//     // });
//   };
// }

// GET request for remote image

/*
Thunk to run python downloader.

const psAsync = promisify(ps.run);

const getArgsJson = state => {
  const jobIds = state.downloader.jobValue
    .split(",")
    .map(jobid => jobid.trim())
    .filter(jobid => jobid.length > 4);

  const taskIds = state.downloader.taskValue
    .split(",")
    .map(taskid => taskid.trim())
    .filter(taskid => taskid.length > 2);

  const outputPath = state.downloader.outputPathValue.trim();

  const args_dict = {};

  if (jobIds.length) {
    args_dict.job_id = jobIds;
  }

  if (jobIds.length == 1) {
    if (taskIds.length) {
      args_dict.task_id = taskIds[0];
    }
  }

  if (outputPath.length) {
    args_dict.output = outputPath;
  }

  return JSON.stringify(args_dict);
};

export function runDownloadJobs() {
  return (dispatch, getState) => {
    const state = getState();

    const options = {
      mode: "text",
      pythonPath: state.environment.settings.pythonPath,
      pythonOptions: ["-u"],
      scriptPath: state.environment.python.scriptsPath
    };

    options.args = [getArgsJson(state)];

    psAsync("download.py", options)
      .then(response => {
        return dispatch(setPythonScriptResponse(response));
      })
      .catch(err => {
        dispatch(pythonScriptFailure(err.message));
      });

    // const filePath = path.join(nw.App.dataPath, settingsFilename);
  };
}
*/
// downloader_parser.add_argument("--job_id",
// help=("The job id(s) to download. When specified "
//       "will only download those jobs and terminate "
//       "afterwards"),
// action='append')

// downloader_parser.add_argument("--task_id",
// help="Manually download output for this task")

// downloader_parser.add_argument("--output",

// export function setPythonSys(params) {
//   return (dispatch, getState) => {
//     const state = getState();

//     const options = {
//       mode: "text",
//       pythonPath: state.settings.pythnPath,
//       pythonOptions: ["-u"]
//     };

//     psAsync("/Users/julian/dev/cnw/src/experiment.py", options)
//       .then(response => {
//         return dispatch(setPySys(response));
//       })
//       .catch(err => {
//         dispatch(envFailure(err.message));
//       });
//   };
// }

/*
Thunk to save Settings to persistent storage.
// */

// let options = {
//   mode: "text",
//   pythonPath: "path/to/python",
//   pythonOptions: ["-u"], // get print results in real-time
//   scriptPath: "path/to/my/scripts",
//   args: ["value1", "value2", "value3"]
// };

// PythonShell.run("my_script.py", options, function(err, results) {
//   if (err) throw err;
//   // results is an array consisting of messages collected during execution
//   console.log("results: %j", results);
// });
