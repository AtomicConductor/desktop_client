import { createReducer } from "redux-starter-kit";
import {
  signInRequest,
  signInError,
  signInSuccess,
  signOut,
  switchAccount
} from "../_actions/user";

import { projectsError, instanceTypesError } from "../_actions/submitter";

const initialState = {
  accounts: [],
  loading: false
};

const unauthorized = statusCode => statusCode === 401;

export default createReducer(initialState, {
  [signInRequest]: state => {
    state.loading = true;
  },
  [signInError]: state => {
    state.loading = false;
  },
  [signInSuccess]: (state, action) => {
    state.loading = false;
    state.accounts = action.payload;
  },
  [signOut]: () => initialState,
  [switchAccount]: (state, action) => {
    state.accounts.forEach(_ => (_.selected = _.id === action.payload));
  },
  [projectsError]: (state, action) => {
    if (unauthorized(action.payload)) {
      return initialState;
    }
  },
  [instanceTypesError]: (state, action) => {
    if (unauthorized(action.payload)) {
      return initialState;
    }
  }
});
