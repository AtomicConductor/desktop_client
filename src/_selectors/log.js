import { createSelector } from "reselect";

const events = state => state.log.events;

const DEFAULT_TEXT = "The log is empty";

const lastEventsSelector = createSelector(
  events,
  events => {
    return events.length
      ? events.slice(-1)[0]
      : { text: DEFAULT_TEXT, level: "info", time: Date.now() };
  }
);

export { lastEventsSelector };
