import { describe, expect, it } from "vitest";

import { truncateText } from "./truncate";

describe("truncateText", () => {
  it("returns short text unchanged", () => {
    expect(truncateText("hello", 20)).toBe("hello");
    expect(truncateText("exact", 5)).toBe("exact");
  });

  it("breaks on a word boundary and appends the ellipsis", () => {
    expect(truncateText("the quick brown fox jumps", 15)).toBe("the quick...");
  });

  it("falls back to a hard cut when there is no space", () => {
    expect(truncateText("supercalifragilistic", 10)).toBe("superca...");
  });

  it("honours a custom ellipsis", () => {
    expect(truncateText("one two three", 9, "…")).toBe("one two…");
  });
});
