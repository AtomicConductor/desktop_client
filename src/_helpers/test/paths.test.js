import { toPosix } from "../paths";

describe("Conversion to posix", () => {
  it("should convert windows with backslashes to posix", () => {
    expect(toPosix("C:\\foo\\bar\\baz")).toBe("/foo/bar/baz");
  });

  it("should leave posix path unchanged", () => {
    expect(toPosix("/foo/bar/baz")).toBe("/foo/bar/baz");
  });
});
