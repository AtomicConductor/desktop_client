import { toPosix } from "../paths";
import { normalize } from "upath";
jest.mock("upath");

describe("Conversion to posix", () => {
  normalize.mockImplementation(_ => _);

  it("should remove windows drive letters", () => {
    expect(toPosix("C:/foo/bar/baz")).toBe("/foo/bar/baz");
  });

  it("should leave posix path unchanged", () => {
    expect(toPosix("/foo/bar/baz")).toBe("/foo/bar/baz");
  });
});
