import { lastEventsSelector } from "../log";

const ss = (overrides = {}) => ({
  log: {
    events: [
      { text: "info1", level: "info", timestamp: 1 },
      { text: "info2", level: "info", timestamp: 2 },
      { text: "error1", level: "error", timestamp: 5 },
      { text: "error2", level: "error", timestamp: 6 }
    ],
    ...overrides
  }
});

describe("log selectors", () => {
  it("returns the last event of many", () => {
    expect(lastEventsSelector(ss())).toEqual(
      expect.objectContaining({
        text: expect.stringMatching(/error2/)
      })
    );
  });

  it("returns log empty event if empty", () => {
    expect(lastEventsSelector(ss({ events: [] }))).toEqual(
      expect.objectContaining({
        text: expect.stringMatching(/log is empty/)
      })
    );
  });
});
