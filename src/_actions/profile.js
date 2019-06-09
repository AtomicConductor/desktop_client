import { createAction } from "redux-starter-kit";
import { promises as fsp } from "fs";

export const requestProfile = createAction("profile/requestProfile");
export const receiveCredentials = createAction("profile/receiveCredentials");
export const receiveUser = createAction("profile/receiveUser");
export const profileFailure = createAction("profile/profileFailure");

/*
Thunk to read credentials from disk AND fetch the users profile.
A number of things can go wrong here, any of which will result 
in a profileFailure action being dispatched.
*/
export function fetchProfile(params) {
  return (dispatch, getState) => {
    const apiserver = getState().environment.project.apiServer;

    dispatch(requestProfile());

    fsp
      .readFile("/Users/julian/.config/conductor/credentials", {
        encoding: "utf8"
      })
      .then(credentials => {
        const obj = JSON.parse(credentials);
        dispatch(receiveCredentials(obj));

        return fetch(`${apiserver}/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${obj.access_token}`
          }
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Authentication error: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        return dispatch(receiveUser(json));
      })
      .catch(err => {
        dispatch(profileFailure(err.message));
      });
  };
}
