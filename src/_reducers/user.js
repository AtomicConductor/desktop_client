import { createReducer } from "@reduxjs/toolkit";
import {
  signInRequest,
  signInError,
  signInSuccess,
  resetUserState,
  switchAccount
} from "../_actions/user";

const initialState = {
  accounts: [],
  loading: false
};

//TODO: add unit test
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
  [resetUserState]: () => initialState,
  [switchAccount]: (state, action) => {
    state.accounts.forEach(_ => (_.selected = _.id === action.payload));
  }
});
