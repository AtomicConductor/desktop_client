import { createAction } from "redux-starter-kit";
// import thunk from "redux-thunk";
import fs from "fs";

export const requestEnv = createAction("env/requestEnv");
export const receiveEnv = createAction("env/receiveEnv");
export const forgetToken = createAction("env/forgetToken");

// export const requestPrereqs = token => ({
//   type: REQUEST_PREREQUISITES,
//   token: token
// });

// export const receivePrereqs = json => ({
//   type: RECEIVE_PREREQUISITES,
//   config: json.config,
//   webtoken: json.webtoken
// });

export function fetchEnvironment(params) {
    return function(dispatch) {
        // look for the creds on disk
        dispatch(requestEnv());

        dispatch(
            receiveEnv({ MODE: "development", APISERVER: "api.conductor.com" })
        );

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
    };
}

// export const forgetToken = () => ({
//   type: FORGET_TOKEN
// });
