import { createAction } from "redux-starter-kit";

//TODO: unit test
export const pushEvent = createAction("log/pushEvent", (text, level) => ({
  payload: {
    text,
    level,
    time: Date.now() //TODO: format datetime here instead of component
  }
}));

export const clearEvents = createAction("log/clearEvents");
export const setLogLength = createAction("log/setLogLength");
