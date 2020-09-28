import { snackbarSelector } from "../snackbar";

const ss = (overrides = {}) => ({
  notification: {
    message: "",
    type: "info",
    url: "",
    buttonLabel: "",
    ...overrides
  }
});

describe("snackbar _selectors", () => {
  describe("snackbarSelector", () => {
    it("returns show=true if message is valid", () => {
      expect(snackbarSelector(ss({ message: "foo" })).show).toBe(true);
    });

    it("returns show=false  if message is invalid", () => {
      expect(snackbarSelector(ss({ message: " " })).show).toBe(false);
    });

    it("returns url=empty  if buttonLabel is empty", () => {
      expect(snackbarSelector(ss({ url: "foo", buttonLabel: "" })).url).toBe(
        ""
      );
    });
  });
});
