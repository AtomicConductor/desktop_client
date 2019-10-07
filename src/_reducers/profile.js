import { createReducer } from "redux-starter-kit";
import jwtDecode from "jwt-decode";

import {
  requestProfile,
  receiveCredentials,
  receiveUser,
  profileFailure,
  signOut
} from "../_actions/profile";

const initialState = {
  credentials: {},
  loadingProfile: false,
  error: "",
  user: {}
};

const profile = createReducer(initialState, {
  /*
  Sets the loading spinner
  */
  [requestProfile]: (state, action) => {
    state.loadingProfile = true;
  },

  /*
  Store credentials / needed to make API requests
  */
  [receiveCredentials]: (state, action) => {
    const decoded = jwtDecode(action.payload.token);

    state.credentials = {
      access_token: action.payload.token,
      ...decoded
    };
  },

  [receiveUser]: (state, action) => {
    state.loadingProfile = false;
    state.error = "";
    state.user = action.payload;
  },

  [signOut]: (state, action) => {
    state.user = {};
    state.credentials = {};
  },

  [profileFailure]: (state, action) => {
    state.user = {};
    state.error = action.payload;
  }
});

export default profile;
