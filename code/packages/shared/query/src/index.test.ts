import { describe, expect, it } from "vitest";
import { queryDefaults, queryKeys } from "./index";

describe("queryKeys — namespaced factory", () => {
  it("roots every key under one prefix", () => {
    expect(queryKeys.all).toEqual(["indiecrafts"]);
    expect(queryKeys.list("posts")).toEqual(["indiecrafts", "posts"]);
    expect(queryKeys.detail("posts", "1")).toEqual([
      "indiecrafts",
      "posts",
      "1",
    ]);
  });

  it("is stable for the same inputs (safe as a cache key)", () => {
    expect(queryKeys.detail("posts", "1")).toEqual(
      queryKeys.detail("posts", "1"),
    );
  });
});

describe("queryDefaults", () => {
  it("disables focus refetch (native apps have no browser-tab focus)", () => {
    expect(queryDefaults.queries.refetchOnWindowFocus).toBe(false);
  });
  it("retries a flaky network before failing", () => {
    expect(queryDefaults.queries.retry).toBeGreaterThan(0);
  });
});
