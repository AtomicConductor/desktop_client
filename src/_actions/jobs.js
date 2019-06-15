import { createAction } from "redux-starter-kit";
import { setNotification } from "./notification";

export const requestJobs = createAction("downloader/requestJobs");
export const receiveJobs = createAction("downloader/receiveJobs");
export const requestJob = createAction("downloader/requestJob");

export const receiveDownloadElement = createAction(
  "downloader/receiveDownloadElement"
);
export const endDownloadRequest = createAction("downloader/endDownloadRequest");

export function fetchJobs(params) {
  return function(dispatch, getState) {
    dispatch(requestJobs());
    const state = getState();
    const apiServer = state.environment.project.apiServer;
    const googleProjectApiServer = state.environment.project.projectUrl;

    const access_token = state.profile.credentials.access_token;
    const url = `${apiServer}/api/v1/jobs`;

    const options = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    const limit = 10;

    return fetch(`${googleProjectApiServer}/jobs`, options)
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
        // get the  <limit> most recent entries

        const id = json.jids
          .map(o => Object.keys(o)[0])
          .sort()
          .slice(-limit)[0];

        return fetch(
          `${apiServer}/api/v1/jobs?limit=2000&filter=jobLabel_gt_${id}`,
          options
        );
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Authentication error: ${response.statusText}`);
        }

        return response.json();
      })
      .then(json => {
        // try to get available downloadable files for these jobs
        //  https://eloquent-vector-104019.appspot.com/downloads/00913

        dispatch(receiveJobs(json));

        return Promise.all(
          json.data.map((job, i) => {
            const url = `${googleProjectApiServer}/downloads/${job.jobLabel}`;
            // const count = i + 1;
            return (
              fetch(url, options)
                .then(
                  response => {
                    if (!response.ok) {
                      throw Error(response.statusText);
                    }
                    return response.json();
                  } //, error => dispatch(httpError(error))
                )
                .then(json => {
                  dispatch(receiveDownloadElement(json));
                })
                // Catch the error so that the promise.all doesn't reject.
                // Error is most likely no content, but maybe some other
                // problem. Either way, catch so we can continue to attempt
                // other fetches,
                .catch(() => {})
            );
          })
        ).then(() => {
          console.log("Done promise all");
          dispatch(endDownloadRequest());
        });
      })

      .catch(function(err) {
        dispatch(
          setNotification({
            type: "error",
            snackbar: err.message,
            detail: { url, options }
          })
        );
      });
  };
}

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
