import { paddedContext } from "../template";

describe("Pad Context", () => {
  it("should create a new unpadded context ", () => {
    const tokens = ["num"];
    const context = { num: 7 };
    expect(paddedContext(tokens, context)).toHaveProperty("num", "7");
  });

  it("should create a new padded context ", () => {
    const tokens = ["num4"];
    const context = { num: 7 };
    expect(paddedContext(tokens, context)).toHaveProperty("num4", "0007");
  });

  it("should ignore tokens absent from the input context", () => {
    const tokens = ["num4", "other2"];
    const context = { num: 7 };
    expect(paddedContext(tokens, context)).not.toHaveProperty("other2");
  });

  it("should ignore context properties absent from the tokens", () => {
    const tokens = ["num4"];
    const context = { num: 7, other: 4 };
    expect(paddedContext(tokens, context)).not.toHaveProperty("other");
  });

  it("should ignore context properties absent from the tokens", () => {
    const tokens = ["num4"];
    const context = { num: 7, other: 4 };
    expect(paddedContext(tokens, context)).not.toHaveProperty("other");
  });

  it("should pad negative numbers", () => {
    const tokens = ["num4"];
    const context = { num: -7, other: 4 };
    expect(paddedContext(tokens, context)).toHaveProperty("num4", "-0007");
  });

  it("should handle many paddings of the same key", () => {
    const tokens = ["num4", "num"];
    const context = { num: 7 };
    expect(paddedContext(tokens, context)).toHaveProperty("num4", "0007");
  });
});
