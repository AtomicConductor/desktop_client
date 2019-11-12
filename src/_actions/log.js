import { createAction } from "redux-starter-kit";

export const pushEvent = createAction("log/pushEvent", (text, level) => ({
  payload: {
    text,
    level,
    time: Date.now()
  }
}));

export const clearEvents = createAction("log/clearEvents");
export const setLogLength = createAction("log/setLogLength");
