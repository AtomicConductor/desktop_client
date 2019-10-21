import { progressions, toSpec } from "../sequence";

describe("sequence helpers", () => {
  describe("progressions", () => {
    it("generates empty progressions array", () => {
      const result = progressions([]);
      expect(result).toEqual([[]]);
    });

    it("generates one progression no gaps", () => {
      const result = progressions([1, 2, 3, 4, 5]);
      expect(result).toEqual([[1, 2, 3, 4, 5]]);
    });

    it("generates one progression with gaps", () => {
      const result = progressions([1, 3, 5, 7]);
      expect(result).toEqual([[1, 3, 5, 7]]);
    });

    it("splits array into progressions", () => {
      const result = progressions([1, 3, 5, 7, 10, 15, 20]);
      expect(result).toEqual([[1, 3, 5, 7], [10, 15, 20]]);
    });

    it("handles single number progressions", () => {
      const result = progressions([1]);
      expect(result).toEqual([[1]]);
    });

    it("handles mixed progressions", () => {
      const result = progressions([1, 3, 5, 7, 10]);
      expect(result).toEqual([[1, 3, 5, 7], [10]]);
    });

    it("handles unsorted input", () => {
      const result = progressions([1, 3, 11, 5, 7, 10]);
      expect(result).toEqual([[1, 3, 5, 7], [10, 11]]);
    });
  });

  describe("toSpec", () => {
    it("generates empty string from empty array", () => {
      const result = toSpec([]);
      expect(result).toBe("");
    });

    it("generates single number spec", () => {
      const result = toSpec([1]);
      expect(result).toBe("1");
    });

    it("generates range spec", () => {
      const result = toSpec([1, 2, 3]);
      expect(result).toBe("1-3");
    });

    it("generates range step spec", () => {
      const result = toSpec([1, 3, 5]);
      expect(result).toBe("1-5x2");
    });

    it("generates mixed spec with commas", () => {
      const result = toSpec([1, 3, 5, 10, 15, 21, 22]);
      expect(result).toBe("1-5x2,10-15x5,21-22");
    });
  });
});
