import { createReducer } from "redux-starter-kit";
import {
  signInRequest,
  signInError,
  signInSuccess,
  signOut,
  switchAccount
} from "../_actions/user";

const initialState = {
  accounts: [],
  loading: false
};

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
  }
});
