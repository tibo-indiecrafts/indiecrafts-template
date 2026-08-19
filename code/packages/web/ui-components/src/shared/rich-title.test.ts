import { describe, expect, it } from "vitest";
import { splitHighlights } from "./rich-title";

describe("splitHighlights", () => {
  it("splits a marked span from its surrounding text", () => {
    expect(splitHighlights("a [[b]] c")).toEqual([
      { text: "a ", highlight: false },
      { text: "b", highlight: true },
      { text: " c", highlight: false },
    ]);
  });

  it("returns one plain segment when there is no marker", () => {
    expect(splitHighlights("plain title")).toEqual([
      { text: "plain title", highlight: false },
    ]);
  });

  it("handles multiple markers", () => {
    expect(splitHighlights("[[one]] and [[two]]")).toEqual([
      { text: "one", highlight: true },
      { text: " and ", highlight: false },
      { text: "two", highlight: true },
    ]);
  });

  it("treats an unmatched opener as literal text", () => {
    expect(splitHighlights("a [[b")).toEqual([
      { text: "a [[b", highlight: false },
    ]);
  });

  it("treats an empty marker as literal text", () => {
    expect(splitHighlights("[[]]")).toEqual([
      { text: "[[]]", highlight: false },
    ]);
  });
});
