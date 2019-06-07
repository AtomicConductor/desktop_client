import { createReducer } from "redux-starter-kit";
import {
  requestProfile,
  receiveCredentials,
  receiveUser,
  profileFailure
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
    state.credentials = action.payload;
  },

  [receiveUser]: (state, action) => {
    state.user = action.payload;
    state.loadingProfile = false;
    state.error = null;
  },

  [profileFailure]: (state, action) => {
    state.user = {};
    state.error = action.payload;
  }
});

export default profile;

///////////////////
