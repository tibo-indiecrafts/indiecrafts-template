import { describe, expect, it } from "vitest";
import { mergePinnedWithFallback, reorderByIds } from "./pin-order";

type Item = { _id: string; label: string };

const item = (id: string): Item => ({ _id: id, label: id });

describe("reorderByIds", () => {
  it("orders items to follow the id array", () => {
    const items = [item("a"), item("b"), item("c")];
    expect(reorderByIds(items, ["c", "a", "b"]).map((i) => i._id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("skips an id that has no matching item", () => {
    const items = [item("a"), item("b")];
    expect(reorderByIds(items, ["z", "b", "a"]).map((i) => i._id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("puts an item not in the id list first (indexOf -1 sorts to front)", () => {
    const items = [item("a"), item("b"), item("c")];
    expect(reorderByIds(items, ["c"]).map((i) => i._id)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("does not mutate the input array", () => {
    const items = [item("a"), item("b")];
    reorderByIds(items, ["b", "a"]);
    expect(items.map((i) => i._id)).toEqual(["a", "b"]);
  });

  it("returns items unchanged in order when ids is empty", () => {
    const items = [item("a"), item("b"), item("c")];
    expect(reorderByIds(items, []).map((i) => i._id)).toEqual(["a", "b", "c"]);
  });
});

describe("mergePinnedWithFallback", () => {
  it("falls back entirely to fallback when pinned is empty", () => {
    const fallback = [item("x"), item("y")];
    const result = mergePinnedWithFallback([], [], fallback, ["y", "x"], 4);
    expect(result.map((i) => i._id)).toEqual(["y", "x"]);
  });

  it("puts pinned first, ordered, then fills with fallback", () => {
    const pinned = [item("a"), item("b")];
    const fallback = [item("x"), item("y")];
    const result = mergePinnedWithFallback(
      pinned,
      ["b", "a"],
      fallback,
      ["y", "x"],
      4,
    );
    expect(result.map((i) => i._id)).toEqual(["b", "a", "y", "x"]);
  });

  it("dedupes a fallback item that is also pinned", () => {
    const pinned = [item("a")];
    const fallback = [item("a"), item("x")];
    const result = mergePinnedWithFallback(
      pinned,
      ["a"],
      fallback,
      ["a", "x"],
      4,
    );
    expect(result.map((i) => i._id)).toEqual(["a", "x"]);
  });

  it("caps the result to count", () => {
    const pinned = [item("a"), item("b")];
    const fallback = [item("x"), item("y"), item("z")];
    const result = mergePinnedWithFallback(
      pinned,
      ["a", "b"],
      fallback,
      ["x", "y", "z"],
      3,
    );
    expect(result.map((i) => i._id)).toEqual(["a", "b", "x"]);
  });

  it("returns all items when count exceeds what's available", () => {
    const pinned = [item("a")];
    const fallback = [item("x")];
    const result = mergePinnedWithFallback(pinned, ["a"], fallback, ["x"], 10);
    expect(result.map((i) => i._id)).toEqual(["a", "x"]);
  });

  it("returns an empty array when both inputs are empty", () => {
    expect(mergePinnedWithFallback([], [], [], [], 4)).toEqual([]);
  });
});
