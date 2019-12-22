import { condenseArray } from "../presentation";

describe("condenseArray", () => {
  it("should condense an array by removing the middle", () => {
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8], 4)).toEqual([1, 2, 7, 8]);
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 4)).toEqual([1, 2, 8, 9]);
  });

  it("should condense an array by removing the middle when max is odd", () => {
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8], 4)).toEqual([1, 2, 7, 8]);
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 4)).toEqual([1, 2, 8, 9]);
  });

  it("should insert an explanation in place of the first omitted element", () => {
    const message = "...message";
    expect(condenseArray([1, 2, 3, 4, 5, 6, 7, 8], 4, message)[2]).toEqual(
      message
    );
  });

  it("should not condense an array smaller than the maxLength", () => {
    const arr = [1, 2, 3, 4];
    expect(condenseArray(arr, 4)).toBe(arr);
  });

  it("should handle an empty array", () => {
    expect(condenseArray([], 4)).toEqual([]);
  });

  it("should return empty array if maxlength 0", () => {
    expect(condenseArray([1, 2, 3, 4], 0)).toEqual([]);
  });

  it("should return first element if maxlength 1", () => {
    expect(condenseArray([1, 2, 3, 4], 1)).toEqual([1]);
  });
});
