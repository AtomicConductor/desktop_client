import { createReducer } from "redux-starter-kit";
import { pushEvent, clearEvents, setLogLength } from "../_actions/log";

const initialState = {
  events: [],
  maxLength: 500
};

const log = createReducer(initialState, {
  [pushEvent]: (state, { payload }) => {
    state.events.push(payload);
    if (state.events.length > state.maxLength) {
      //TODO: consider using splice
      state.events = state.events.slice(-state.maxLength);
    }
  },
  [clearEvents]: (state, action) => {
    state.events = [];
  },
  [setLogLength]: (state, { payload }) => {
    state.maxLength = payload;
  }
});

export default log;
