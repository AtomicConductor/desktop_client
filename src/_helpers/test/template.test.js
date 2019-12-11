import { compile } from "../template";

describe("semantic templates", () => {
  describe("pad", () => {
    it("should pad a given value", () => {
      const template = "<pad num 4>";
      const context = { num: 7 };
      expect(compile(template)(context)).toBe("0007");
    });

    it("should pad negative numbers", () => {
      const template = "<pad num 4>";
      const context = { num: -7 };
      expect(compile(template)(context)).toBe("-0007");
    });

    it("should handle many paddings of the same key", () => {
      const template = "<pad num 4> <num>";
      const context = { num: 7 };
      expect(compile(template)(context)).toBe("0007 7");
    });
  });
});
