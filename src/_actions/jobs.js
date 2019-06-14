import { createAction } from "redux-starter-kit";
import { setNotification } from "./notification";

export const requestJobs = createAction("downloader/requestJobs");
export const receiveJobs = createAction("downloader/receiveJobs");
export const requestJob = createAction("downloader/requestJob");

export function fetchJobs(params) {
  return function(dispatch, getState) {
    dispatch(requestJobs());
    const state = getState();
    const apiServer = state.environment.project.apiServer;
    const googleProjectApiServer = state.environment.project.projectUrl;

    const access_token = state.profile.credentials.access_token;
    const url = `${apiServer}/api/v1/jobs`;
    const options = { headers: { Authorization: `Bearer ${access_token}` } };

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
        // get the 100th <limit> entries
        // console.log(json.jids.map(o => Object.keys(o)[0]);
        const ids = json.jids
          .map(o => Object.keys(o)[0])
          .sort()
          .slice(-limit);
        return dispatch(receiveJobs(ids));
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
