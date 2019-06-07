import { createAction } from "redux-starter-kit";
import { promises as fsp } from "fs";

export const requestProfile = createAction("profile/requestProfile");
export const receiveCredentials = createAction("profile/receiveCredentials");
export const receiveUser = createAction("profile/receiveUser");
export const profileFailure = createAction("profile/profileFailure");

// const fsp = require("fs").promises;

// export const getCredentials = createAction("profile/getCredentials");

/*
Thunk to read credentials from disk AND get then fetch the users profile.
A number of things can go wrong here, any of which will result 
in the errors
*/

export function fetchProfile(params) {
    return (dispatch, getState) => {
        const apiserver = getState().environment.data.APISERVER;

        dispatch(requestProfile());

        fsp.readFile("/Users/julian/.config/conductor/credentials", {
            encoding: "utf8"
        })
            .then(response => {
                const obj = JSON.parse(response);
                dispatch(receiveCredentials(obj));

                return fetch(`${apiserver}/api/v1/profile`, {
                    headers: {
                        Authorization: `Bearer ${obj.access_token}`
                    }
                });
            })
            .then(response => response.json())
            .then(json => {
                dispatch(receiveUser(json));
            })
            .catch(err => {
                dispatch(profileFailure(err));
            });
    };
}

// const creds_status = response => {
//     if (response) {
//         return Promise.resolve(response);
//     }
//     return Promise.reject(new Error(response.statusText));
// };

// return fetch(`/prerequisite?token=${webtoken}`)
//     .then(
//         response => response.json(),
//         error => dispatch(receivePrereqs({}))
//     )
//     .then(json => {
//         dispatch(receivePrereqs(json));
//         dispatch(fetchProfile());
//         dispatch(fetchAccounts({ limit: 1, name: "conductor" }));
//     })
//     .catch(function(error) {
//         /*
// There was a warning in redux docs about use of catch().
// Basically they say don't use it because of a react bug.
// // https://github.com/facebook/react/issues/6895
// However - it seems fixed so I'm putting it back
// */
//         dispatch(receivePrereqs({}));
//     });

// look for the creds on disk
// dispatch(requestEnv());

// return fs.readFile(
//     "/Users/julian/.config/conductor/credentials",
//     "utf8",
//     function(error, data) {
//         if (error) {
//             dispatch(receiveEnv({ token: "" }));
//         } else {
//             dispatch(receiveEnv({ token: data }));
//         }
//     }
// );

// return fs.readFile(
//     "/Users/julian/.config/conductor/credentials",
//     "utf8",
//     function(error, data) {
//         if (error) {
//             dispatch(receiveEnv({ token: "" }));
//         } else {
//             dispatch(receiveEnv({ token: data }));
//         }
//     }
// );

// return fs.readFile("/Users/julian/.config/conductor/credentials", )
//     .then(
//          response => console.log(response)

//         )

// var result = fetch(url, {
//     method: "get"
// })
//     .then(function(response) {
//         return response.json(); // pass the data as promise to next then block
//     })
//     .then(function(data) {
//         var rocketId = data.rocket.rocket_id;

//         console.log(rocketId, "\n");

//         return fetch("https://api.spacexdata.com/v2/rockets/" + rocketId); // make a 2nd request and return a promise
//     })
//     .then(function(response) {
//         return response.json();
//     })
//     .catch(function(error) {
//         console.log("Request failed", error);
//     });

// const status = response => {
//     if (response.status >= 200 && response.status < 300) {
//         return Promise.resolve(response);
//     }
//     return Promise.reject(new Error(response.statusText));
// };

// const json = response => response.json();

// fetch("/todos.json")
//     .then(status) // note that the `status` function is actually **called** here, and that it **returns a promise***
//     .then(json) // likewise, the only difference here is that the `json` function here returns a promise that resolves with `data`
//     .then(data => {
//         // ... which is why `data` shows up here as the first parameter to the anonymous function
//         console.log("Request succeeded with JSON response", data);
//     })
//     .catch(error => {
//         console.log("Request failed", error);
//     });

/*
filehandle.readFile(options)#
Added in: v10.0.0
options <Object> | <string>

encoding <string> | <null> Default: null
flag <string> See support of file system flags. Default: 'r'.
Returns: <Promise>
Asynchronously reads the entire contents of a file.

The Promise is resolved with the contents of the file. If no encoding is specified (using options.encoding), the data is returned as a Buffer object. Otherwise, the data will be a string.

If options is a string, then it specifies the encoding.

When the path is a directory, the behavior of fsPromises.readFile() is platform-specific. On macOS, Linux, and Windows, the promise will be rejected with an error. On FreeBSD, a representation of the directory's contents will be returned.

The FileHandle has to support reading.

If one or more filehandle.read() calls are made on a file handle and then a filehandle.readFile() call is made, the data will be read from the current position till the end of the file. It doesn't always read from the beginning of the file.

*/
