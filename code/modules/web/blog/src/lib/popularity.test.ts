import { describe, expect, it } from "vitest";
import { getPopularPostIds } from "./popularity";

describe("getPopularPostIds", () => {
  it("returns empty until the read-count pipeline lands (Project 2)", async () => {
    expect(await getPopularPostIds("en", 4)).toEqual([]);
  });
});
