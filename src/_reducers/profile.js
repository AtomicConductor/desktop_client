import { createReducer } from "redux-starter-kit";
import {
  requestProfile,
  receiveCredentials,
  receiveUser,
  profileFailure,
  signOut
} from "../_actions/profile";

const initialState = {
  credentials: {
    access_token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkLmNvbmR1Y3RvcnRlY2guY29tIiwic3ViIjoiNTY1OTk3NDYwODg3OTYxNiIsImF1ZCI6Imh0dHBzOi8vYXBpLmNvbmR1Y3RvcnRlY2guY29tIiwiZXhwIjoxNTYzMTQwNTQ3LCJlbWFpbCI6Imp1bGlhbi5tYW5uQGFkbWlvcy1zYS5jb20iLCJpZCI6IjU2NTk5NzQ2MDg4Nzk2MTYiLCJhY2NvdW50Ijo1NjY5NTQ0MTk4NjY4Mjg4LCJyb2xlIjowLCJzY29wZSI6InN1cGVydXNlciBvd25lciBhZG1pbiB1c2VyIiwiaWF0IjoxNTYzMDU0MTQ3fQ.nbIdDiqpBtveCukEszJULc_zkqRiyWtUbynFUJkHexA28fSB0H_5bIv-y4hTYofo3ZJJPhmD1zMHWLWrFgdARfvhmv6yG6g8dW1jSIQe1t_hlkZsFQZoIa-luQh7dOT58KgzE0dh28Pv-0bZm7_wY-gaCbFHxs0xXfCdgB248P-Zm8a_zqLWM8HD__ZldnTaGoaTxe5QtNQMIPdYS1zW7gawIhKsUQeWsXZGK_oh5yMnP7St53z1LdrClA0EriGZyLv-UggYoX7MNUwKXLXBpTf8prqYUiyG59K74mrKzxVH7n9CVTCcxWBMLb1ql0KnsASE9wrHbW0uJt9JEjd-Mw"
  },
  loadingProfile: false,
  error: "",
  user: {
    links: {
      self: "/api/users/5659974608879616",
      next: null
    },
    data: {
      uid: "ekzVDXZrOBNjYNtOC1N5lELznUM2",
      status: "active",
      selfLink: "/api/users/5659974608879616",
      role: 0,
      id: "5659974608879616",
      email: "julian.mann@admios-sa.com",
      createdOn: "2017-09-27T02:21:04.788Z",
      account: 5669544198668288
    }
  }
};

// const initialState = {
//   credentials: {},
//   loadingProfile: false,
//   error: "",
//   user: {}
// };

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
    state.credentials = {
      access_token: action.payload.token
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

///////////////////
