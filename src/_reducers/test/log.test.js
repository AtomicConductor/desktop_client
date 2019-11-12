import reducer from "../log";
import { pushEvent, clearEvents, setLogLength } from "../../_actions/log";

describe("log reducer", () => {
  describe("pushEvent", () => {
    let initialState;
    beforeEach(() => {
      initialState = {
        events: [
          { text: "a", level: "info", time: 1234 },
          { text: "b", level: "error", time: 1234 }
        ],
        maxLength: 500
      };
    });

    it("appends an entry to the log", () => {
      const state = reducer(initialState, pushEvent("a message", "info"));

      expect(state.events[2]).toEqual(
        expect.objectContaining({
          text: "a message",
          level: "info",
          time: expect.anything()
        })
      );
    });

    it("keeps the log at max length", () => {
      initialState.maxLength = 3;
      let state = reducer(initialState, pushEvent("a message", "info"));
      state = reducer(state, pushEvent("another message", "info"));

      expect(state.events[0]).toEqual(
        expect.objectContaining({
          text: "b"
        })
      );
    });
  });
});
