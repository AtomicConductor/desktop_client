import { condenseArray } from "../presentation";

describe("condenseArray", () => {
  it("should condense an array by removing the middle", () => {
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8], 4)).toEqual([
      1,
      2,
      "For display performance reasons, 4 entries have been hidden...",
      7,
      8
    ]);
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 4)).toEqual([
      1,
      2,
      "For display performance reasons, 5 entries have been hidden...",
      8,
      9
    ]);
  });

  it("should condense an array by removing the middle when max is odd", () => {
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8], 3)).toEqual([
      1,
      2,
      "For display performance reasons, 5 entries have been hidden...",
      8
    ]);
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([
      1,
      2,
      "For display performance reasons, 6 entries have been hidden...",
      9
    ]);
  });

  it("should not condense an array smaller than the maxLength", () => {
    const arr = [1, 2, 3, 4];
    expect(condenseArray(arr, 4)).toEqual(arr);
  });

  it("should handle an empty array", () => {
    expect(condenseArray([], 4)).toEqual([]);
  });

  it("should return empty array if maxlength 0", () => {
    expect(condenseArray([1, 2, 3, 4], 0)).toEqual([]);
  });

  it("should return first element if maxlength is 1", () => {
    expect(condenseArray([1, 2, 3, 4], 1)).toEqual([1]);
  });

  it("should return en empty array if input is an empty array", () => {
    expect(condenseArray([])).toEqual([]);
  });
});
