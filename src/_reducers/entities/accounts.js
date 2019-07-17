import { createReducer } from "redux-starter-kit";

import { receiveAccounts, signOut } from "../../_actions/profile";

const initialState = {};

const accounts = createReducer(initialState, {
  [receiveAccounts]: (state, action) => {
    const { accounts } = action.payload;
    if (!accounts) {
      throw Error("Can't sign in");
    }

    accounts.forEach(account => {
      state[account.account] = account;
    });
  },

  [signOut]: (state, action) => {
    for (const k in state) {
      if (state.hasOwnProperty(k)) {
        delete state[k];
      }
    }
  }
});

export default accounts;
