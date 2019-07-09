import { createAction } from "redux-starter-kit";
import { setNotification } from "./notification";
import { createRequestOptions } from "../_helpers/network";
import path from "upath";
import fs from "fs";
import md5File from "md5-file";
import { checkResponse } from "../_helpers/network";
import {
  directoryExistsSync,
  exactFileExistsSync
} from "../_helpers/fileSystem";

export const requestJobs = createAction("downloader/requestJobs");
export const receiveJobs = createAction("downloader/receiveJobs");

export const requestJob = createAction("downloader/requestJob");
export const setOutputPathValue = createAction("downloader/setOutputPathValue");
export const resetOutputPathValue = createAction(
  "downloader/resetOutputPathValue"
);

export const endDownloadRequest = createAction("downloader/endDownloadRequest");
export const setFileExistsLocally = createAction(
  "downloader/setFileExistsLocally"
);
export const requestDownloadData = createAction(
  "downloader/requestDownloadData"
);
export const receiveDownloadSummary = createAction(
  "downloader/receiveDownloadSummary"
);

export const requestExistingFilesInfo = createAction(
  "downloader/requestExistingFilesInfo"
);

export const receiveExistingFilesInfo = createAction(
  "downloader/receiveExistingFilesInfo"
);

/*
Takes an array of objects whose keys are IDs, and returns the 
Id of the Nth item 
*/

const getPartitionId = (data, n) => {
  const sorted = data.map(o => Object.keys(o)[0]).sort();
  if (data.length <= n) {
    return sorted[0] - 1;
  }
  return sorted.reverse()[n];
};

/* 
A thunk that wraps getRecentJobs(). 
1. dispatch(requestJobs()); - maybe start a spinner
2. call getRecentJobs
3. dispatch(receiveJobs(data)); - add data to store, kill the spinner etc.
*/
export function fetchJobs() {
  return async function(dispatch, getState) {
    dispatch(requestJobs());
    try {
      const data = await getRecentJobs(20, getState());
      dispatch(receiveJobs(data));
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

/* 
Function to do two fetches, one after the other.
First fetch the summary list and work out the id of the `partition` record.
Now the second fetch gets the jobs created after that partition job
*/
async function getRecentJobs(limit, state) {
  // options is just headers, content type etc.
  const options = createRequestOptions(state);

  const { apiServer, projectUrl } = state.environment.project;

  let url = `${projectUrl}/jobs`;
  let response = await fetch(url, options);
  checkResponse(response);

  let data = await response.json();
  const oldestId = getPartitionId(data.jids, limit);
  // console.log(oldestId);
  url = `${apiServer}/api/v1/jobs?limit=2000&filter=jobLabel_gt_${oldestId}`;
  response = await fetch(url, options);
  checkResponse(response);

  data = await response.json();
  return data;
}

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

export function fetchDownloadSummary(jobLabel) {
  return async function(dispatch, getState) {
    dispatch(requestDownloadData(jobLabel));
    try {
      // const data = await getDownloadSummary(jobLabel, getState());

      console.log("getDownloadFiles");
      var startTime = new Date();
      const data = await getDownloadFiles(jobLabel, getState());
      // const downloadTime = new Date();
      // console.log("DONE getDownloadFiles");

      dispatch(receiveDownloadSummary(data));
      // const receiveDownloadTime = new Date();
      // console.log("DONE receiveDownloadSummary");

      setTimeout(function() {
        dispatch(updateExistingFilesInfo({ jobLabel }));
      }, 2000);
      // const updateExistingTime = new Date();
      // console.log("DONE updateExistingFilesInfo");

      // const downloadDuration = downloadTime - startTime;
      // const receiveDownloadDuration = receiveDownloadTime - downloadTime;
      // const updateExistingDuration = updateExistingTime - receiveDownloadTime;

      // const total =
      //   downloadDuration + receiveDownloadDuration + updateExistingDuration;

      // console.log(
      //   "! downloadDuration= " +
      //     downloadDuration +
      //     " = " +
      //     (downloadDuration * 100) / parseFloat(total) +
      //     "%"
      // );

      // console.log(
      //   "! receiveDownloadDuration= " +
      //     receiveDownloadDuration +
      //     " = " +
      //     (receiveDownloadDuration * 100) / parseFloat(total) +
      //     "%"
      // );

      // console.log(
      //   "! updateExistingDuration= " +
      //     updateExistingDuration +
      //     " = " +
      //     (updateExistingDuration * 100) / parseFloat(total) +
      //     "%"
      // );

      // const numExisting = checkExistingFilesInfo(
      //   data.files,
      //   data.outputDirectory
      // );

      // console.log("numExisting: " + numExisting);
      // dispatch(receiveExistingFilesInfo({ jobLabel, numExisting }));
    } catch (error) {
      dispatch(
        setNotification({
          type: "info",
          snackbar: "Can't fetch download data for this job."
        })
      );
      dispatch(
        receiveDownloadSummary({
          jobLabel
        })
      );
    }
  };
}

// export function getDownloadFilesTK({ jobLabel }) {
//   return async function(dispatch, getState) {
//     // const s = getState();
//     dispatch(requestDownloadData(jobLabel));
//     const jobs = getState().entities.jobs;

//     // console.log("JOB LABEL: " + jobLabel);

//     // console.log("numExisting: " + numExisting);
//     // const start = new Date();
//     const existing = await checkExistingFilesInfo(jobs[jobLabel]);
//     dispatch(receiveExistingFilesInfo({ jobLabel, existing }));
//     // const end = new Date();

//     // console.log("TIMING - updateExistingFilesInfo: " + (end - start));

//     // dispatch(receiveExistingFilesInfo({ jobLabel, existing }));
//   };
// }

async function getDownloadFiles(jobLabel, state) {
  /**
   * Return an object containing a list of files and a download directory.
   * Also tag on the jobLabel
   */

  const options = createRequestOptions(state);
  const { projectUrl } = state.environment.project;
  const url = `${projectUrl}/downloads/${jobLabel}`;
  let response = await fetch(url, options);
  console.log(url);
  console.log(options);

  checkResponse(response);
  console.log(response);
  let data = await response.json();
  console.log(data);
  let outputDirectory = null;
  let first = true;
  const files = {};

  const downloads = data.downloads || [];

  downloads.forEach(task => {
    return task.files.forEach(file => {
      if (first) {
        outputDirectory = file["output_dir"];
        first = false;
      }
      const rp = file["relative_path"];

      files[rp] = {
        relativePath: rp,
        md5: file["md5"]
      };
    });
  });
  return { files, jobLabel, outputDirectory };
}

export function updateExistingFilesInfo({ jobLabel }) {
  return async function(dispatch, getState) {
    // const s = getState();
    dispatch(requestExistingFilesInfo(jobLabel));
    const jobs = getState().entities.jobs;

    // console.log("JOB LABEL: " + jobLabel);

    // console.log("numExisting: " + numExisting);
    // const start = new Date();
    const existing = await checkExistingFilesInfo(jobs[jobLabel]);
    dispatch(receiveExistingFilesInfo({ jobLabel, existing }));
    // const end = new Date();

    // console.log("TIMING - updateExistingFilesInfo: " + (end - start));

    // dispatch(receiveExistingFilesInfo({ jobLabel, existing }));
  };
}

const checkExistingFilesInfo = job => {
  // return an array that contains only relative paths of the files that exist
  // in the output directory on disk
  const result = [];
  if (!job) {
    return result;
  }

  const { outputDirectory, files } = job;

  if (!directoryExistsSync(outputDirectory)) {
    return result;
  }
  if (!files) {
    return result;
  }

  Object.values(files).forEach(f => {
    const fullPath = path.join(outputDirectory, f.relativePath);
    const md5 = f.md5;
    // console.log("fullPath: " + fullPath + "  --  md5: " + md5);
    if (exactFileExistsSync(fullPath, md5)) {
      result.push(f.relativePath);
    }
  });
  return result;
};

/**
 We don't want the filenames and stuff. 
 Wejust want the minimum information necessary to display the panel.
*/
// async function getDownloadSummary(jobLabel, state) {
//   // options is just headers, content type etc.
//   const options = createRequestOptions(state);

//   const { projectUrl } = state.environment.project;
//   const url = `${projectUrl}/downloads/${jobLabel}`;
//   let response = await fetch(url, options);
//   checkResponse(response);

//   let data = await response.json();

//   let outputDirectory = null;
//   let first = true;
//   let fileCount = 0;

//   const downloads = data.downloads || [];

//   downloads.forEach(task => {
//     task.files.forEach(file => {
//       if (first) {
//         outputDirectory = file["output_dir"];
//         first = false;
//       }
//     });
//     fileCount += task.files.length || 0;
//   });
//   return { fileCount, jobLabel, outputDirectory };
// }

// const oldestId = getPartitionId(data.jids, limit);

// url = `${apiServer}/api/v1/jobs?limit=2000&filter=jobLabel_gt_${oldestId}`;
// response = await fetch(url, options);
// checkResponse(response);

// data = await response.json();
// return data;

/*


*/

// const checkexactFileExistsSync = (md5, filePath) => {
//   return new Promise(function(resolve, reject) {
//     try {
//       fs.statSync(filePath).isFile();
//       resolve(Buffer.from(md5File.sync(filePath)).toString("base64") === md5);
//     } catch (err) {
//       resolve(false);
//     }
//   });
// };

// const checkexactFileExistsSyncThunk = (
//   jobLabel,
//   md5,
//   relativePath,
//   outputDirectory
// ) => {
//   return function(dispatch, getState) {
//     const filePath = path.join(outputDirectory, relativePath);
//     return checkexactFileExistsSync(md5, filePath).then(exists =>
//       dispatch(setFileExistsLocally({ jobLabel, relativePath, exists }))
//     );
//   };
// };

// export function betterFetchJobs() {
//   return async function(dispatch, getState) {
//     dispatch(requestJobs());
//     const state = getState();
//     const options = createRequestOptions(state);
//     // const { apiServer, projectUrl } = state.environment.project;
//     const limit = 3;

//     const url = `${state.environment.project.projectUrl}/jobs`;

//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(response.statusText);
//       }
//       const data = await response.json();

//       const jid = getPartitionId(data.jids, limit);

//       console.log("DATA!");
//       console.log(jid);
//     } catch (error) {
//       dispatch(
//         setNotification({
//           type: "error",
//           snackbar: error.message,
//           detail: { url, options }
//         })
//       );
//     }
//   };
// }

/* 

export function old_fetchJobs(params) {
  return function(dispatch, getState) {
    dispatch(requestJobs());
    const state = getState();

    const options = createRequestOptions(state);
    const { apiServer, projectUrl } = state.environment.project;
    const limit = 5;

    return (
      dispatch(fetchIdOfFirstJob(limit))
        .then(id => {
          const url = `${apiServer}/api/v1/jobs?limit=2000&filter=jobLabel_gt_${id}`;
          return fetch(url, options);
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(json => {
          dispatch(receiveJobs(json));
          return Promise.all(
            json.data.map((job, i) => {
              const jobLabel = job.jobLabel;
              const url = `${projectUrl}/downloads/${jobLabel}`;

              return fetchFilesForJob(url, options)
                .then(data => {
                  const { files, outputDirectory } = data;
                  dispatch(
                    receiveFilesForJob({ files, jobLabel, outputDirectory })
                  );

                  return Promise.all(
                    files.map(file => {
                      return dispatch(
                        checkexactFileExistsSyncThunk(
                          jobLabel,
                          file.md5,
                          file.relativePath,
                          outputDirectory
                        )
                      );
                    })
                  );
                })

                .catch(err => {
                  console.log(job.jobLabel + " -- " + err.message);
                });

              // dispatch(fetchDownloadForJob(job.jobLabel));
            })
          );
        })
        // .then(() => {
        //   console.log("Checking existence");

        //   let jobs = Object.values(state.entities.jobs);
        //   console.log("jobs length: " + jobs.length);
        //   jobs.forEach(j => {
        //     console.log("JJJ" + j.outputDirectory + " " + j.files.length);
        //   });

        //   jobs = jobs.filter(j => Boolean(j.outputDirectory && j.files));
        //   console.log("jobs length: " + jobs.length);

        //   const promises = jobs
        //     .filter(j => Boolean(j.outputDirectory && j.files))
        //     .flatMap(job => {
        //       return Object.values(job.files).map(file => {
        //         return dispatch(checkexactFileExistsSync(job.jobLabel, file.md5, {}));
        //       });
        //     });
        //   console.log(promises);

        //   return Promise.all(promises);
        // })
        .catch(function(err) {
          dispatch(
            setNotification({
              type: "error",
              snackbar: err.message,
              detail: { options }
            })
          );
        })
    );
  };
}

export function fetchIdOfFirstJob(params) {
  return function(dispatch, getState) {
    const state = getState();
    const options = createRequestOptions(state);
    const url = `${state.environment.project.projectUrl}/jobs`;
    const limit = 3;

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        if (typeof json.status_code === "number" && json.status_code >= 400) {
          throw new Error(json);
        }

        return new Promise(function(resolve, reject) {
          if (!("jids" in json && json.jids.length)) {
            reject(new Error("No Job IDs"));
          }
          const jid = json.jids
            .map(o => Object.keys(o)[0])
            .sort()
            .slice(-(limit + 1))[0];
          resolve(jid);
        });
      });
  };
}

// const url = `${state.environment.project.projectUrl}/jobs`;
export function aaFetchIdOfFirstJob(url, options, limit) {
  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(json => {
      if (typeof json.status_code === "number" && json.status_code >= 400) {
        throw new Error(json);
      }

      return new Promise(function(resolve, reject) {
        if (!("jids" in json && json.jids.length)) {
          reject(new Error("No Job IDs"));
        }
        const jid = json.jids
          .map(o => Object.keys(o)[0])
          .sort()
          .slice(-(limit + 1))[0];
        resolve(jid);
      });
    });
}

export function fetchDownloadForJob(jobLabel) {
  return function(dispatch, getState) {
    const state = getState();
    const options = createRequestOptions(state);
    const url = `${state.environment.project.projectUrl}/downloads/${jobLabel}`;

    console.log(`fetchDownloadForJob ${jobLabel}`);
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        dispatch(
          receiveFilesForJob({ data: json.downloads, jobLabel: jobLabel })
        );
        // return new Promise(function(resolve, reject){

        //   resolve(jso.)
        // })
      })
      .catch(() => {});
  };
}

// const state = getState();
// const options = createRequestOptions(state);
// const url = `${state.environment.project.projectUrl}/downloads/${jobLabel}`;

function fetchFilesForJob(url, options) {
  console.log("fetching!!" + url);
  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      const result = response.json();

      return result;
    })
    .then(json => {
      return new Promise(function(resolve, reject) {
        let outputDirectory = null;
        let files = [];
        let first = true;

        if (json.downloads) {
          files = json.downloads.flatMap(task => {
            return task.files.map(file => {
              if (first) {
                outputDirectory = file["output_dir"];
                first = false;
              }
              return {
                relativePath: file["relative_path"],
                md5: file["md5"]
              };
            });
          });
        }
        resolve({ files, outputDirectory });
      });
    });
}

// .then(value => {
//   return dispatch(setFileExistsLocally({ md5, jobLabel, exists: value }));
// })
// .catch(() => {});

// export function checkexactFileExistsSync(jobLabel, md5, opts) {
//   return function(dispatch, getState) {
//     const state = getState();
//     const job = state.entities.jobs[jobLabel];
//     return new Promise(function(resolve, reject) {
//       if (!(job.outputDirectory && job.files)) {
//         reject(new Error("Job has no files."));
//       }
//       const directory = opts.directory || job.outputDirectory;
//       const filePath = path.join(directory, job.files[md5].relativePath);

//       const stats = fs.statSync(filePath);
//       if (!stats.isFile()) {
//         resolve(false);
//       }
//       const localMd5 = Buffer.from(md5File.sync(filePath)).toString("base64");
//       resolve(localMd5 === md5);
//     })
//       .then(value => {
//         return dispatch(setFileExistsLocally({ md5, jobLabel, exists: value }));
//       })
//       .catch(() => {});
//   };
// }

// const checkJobdirectoryExistsSync = directory

// export function checkJobdirectoryExistsSync(jobLabel) {
//   return function(dispatch, getState) {
//     const state = getState();
//     const job = state.entities.jobs[jobLabel];
//     return new Promise(function(resolve, reject) {

//       if (!(job.outputDirectory && job.files)) {
//         reject(new Error("Job has no files."));
//       }
//       const directory = opts.directory || job.outputDirectory;
//       const filePath = path.join(directory, job.files[md5].relativePath);

//       const stats = fs.statSync(filePath);
//       resolve(
//         stats.isFile() &&
//           Buffer.from(md5File.sync(filePath)).toString("base64") === md5
//       );
//     });
//   };
// }

// export function fetchJobs(params) {
//   return function(dispatch, getState) {
//     dispatch(requestJobs());
//     const state = getState();
//     const apiServer = state.environment.project.apiServer;
//     const access_token = state.profile.credentials.access_token;
//     const url = `${apiServer}/api/v1/jobs`;
//     const options = { headers: { Authorization: `Bearer ${access_token}` } };
//     return fetch(`${apiServer}/api/v1/jobs`, options)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(response.statusText);
//         }
//         return response.json();
//       })
//       .then(json => {
//         if (typeof json.status_code === "number" && json.status_code >= 400) {
//           throw new Error(json);
//         }
//         dispatch(receiveJobs(json));
//       })
//       .catch(function(err) {
//         dispatch(
//           setNotification({
//             type: "error",
//             snackbar: err.message,
//             detail: { url, options }
//           })
//         );
//       });
//   };
// }

// export const requestJobs = () => ({
//   type: REQUEST_JOBS
// });

// export const requestJob = () => ({
//   type: REQUEST_JOB
// });
// export const receiveJobs = json => ({
//   /* !!!!!!!!!!! coerce to array */
//   type: RECEIVE_JOBS,
//   jobs: Array.isArray(json.data) ? json.data : json.data ? [json.data] : []
// });

/*
Thunk to read credentials from disk AND fetch the users profile.
A number of things can go wrong here, any of which will result 
in a profileFailure action being dispatched.
*/
// export function fetchProfile(params) {
//     return (dispatch, getState) => {
//       const apiServer = getState().environment.project.apiServer;

//       dispatch(requestProfile());

//       fsp
//         .readFile("/Users/julian/.config/conductor/credentials", {
//           encoding: "utf8"
//         })
//         .then(credentials => {
//           const obj = JSON.parse(credentials);
//           dispatch(receiveCredentials(obj));

//           return fetch(`${apiServer}/api/v1/profile`, {
//             headers: {
//               Authorization: `Bearer ${obj.access_token}`
//             }
//           });
//         })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error(`Authentication error: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then(json => {
//           return dispatch(receiveUser(json));
//         })
//         .catch(err => {
//           dispatch(profileFailure(err.message));
//         });
//     };
//   }

// export function fetchJobs(params) {
//     const paramsWithPath = Object.assign({}, params, { path: "/jobs" });
//     return function(dispatch, getState) {
//       return dispatch(
//         fetchResource(
//           paramsWithPath,
//           requestJobs,
//           receiveJobs,
//           setErrorNotification
//         )
//       );
//     };
//   }

// export function fetchJobs(params) {
//   const paramsWithPath = Object.assign({}, params, { path: "/jobs" });
//   return function(dispatch, getState) {
//     return dispatch(
//       fetchResource(
//         paramsWithPath,
//         requestJobs,
//         receiveJobs,
//         setErrorNotification
//       )
//     );
//   };
// }

// export function fetchJob(id, params) {
//   const paramsWithPath = Object.assign({}, params, { path: `/jobs/${id}` });
//   return function(dispatch, getState) {
//     return dispatch(
//       fetchResource(
//         paramsWithPath,
//         requestJob,
//         receiveJobs,
//         setErrorNotification
//       )
//     );
//   };
// }
