import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import {
  isValidLocale,
  isValidPostId,
  recordView,
  topPostIds,
  utcDay,
} from "./post-views";

const db = () => env.MAIN_DB!;
const count = async (postId: string, locale: string, day: string) =>
  (
    await db()
      .prepare(
        "SELECT views FROM post_views WHERE post_id = ? AND locale = ? AND day = ?",
      )
      .bind(postId, locale, day)
      .first<{ views: number }>()
  )?.views;

describe("post-views", () => {
  it("isValidPostId keeps published Sanity ids, rejects the rest", () => {
    for (const id of ["abc123", "post-1", "a.b_c-D", "x".repeat(128)])
      expect(isValidPostId(id)).toBe(true);
    for (const id of [
      "",
      "drafts.abc",
      "versions.r1.abc",
      "a b",
      "a/b",
      "é",
      "x".repeat(129),
      42,
      null,
      undefined,
    ])
      expect(isValidPostId(id)).toBe(false);
  });

  it("isValidLocale accepts xx and xx-XX only", () => {
    for (const l of ["en", "fr", "en-GB"]) expect(isValidLocale(l)).toBe(true);
    for (const l of ["", "EN", "eng", "en-gb", "en_GB", "en-GBR", 1, null])
      expect(isValidLocale(l)).toBe(false);
  });

  it("utcDay is the UTC calendar day, offset by daysAgo", () => {
    const now = new Date("2026-10-07T23:30:00Z");
    expect(utcDay(now)).toBe("2026-10-07");
    expect(utcDay(now, 29)).toBe("2026-09-08");
  });

  it("recordView inserts at 1, then increments the same counter", async () => {
    await recordView(db(), "pv-inc", "en", "2026-10-01");
    expect(await count("pv-inc", "en", "2026-10-01")).toBe(1);
    await recordView(db(), "pv-inc", "en", "2026-10-01");
    expect(await count("pv-inc", "en", "2026-10-01")).toBe(2);
    // Another day or locale is its own counter.
    await recordView(db(), "pv-inc", "fr", "2026-10-01");
    await recordView(db(), "pv-inc", "en", "2026-10-02");
    expect(await count("pv-inc", "fr", "2026-10-01")).toBe(1);
    expect(await count("pv-inc", "en", "2026-10-02")).toBe(1);
  });

  it("topPostIds sums views in the window, filters the locale, ties by id", async () => {
    const view = (id: string, locale: string, day: string, n: number) =>
      Promise.all(
        Array.from({ length: n }, () => recordView(db(), id, locale, day)),
      );
    await view("top-a", "de", "2026-09-10", 2);
    await view("top-a", "de", "2026-09-11", 2); // a = 4 in window
    await view("top-b", "de", "2026-09-11", 5); // b = 5
    await view("top-c", "de", "2026-09-01", 9); // outside the window
    await view("top-d", "de", "2026-09-10", 4); // d = 4, ties a → a first
    await view("top-e", "es", "2026-09-11", 9); // other locale

    expect(await topPostIds(db(), "de", "2026-09-10", 10)).toEqual([
      "top-b",
      "top-a",
      "top-d",
    ]);
    expect(await topPostIds(db(), "de", "2026-09-10", 1)).toEqual(["top-b"]);
    expect(await topPostIds(db(), "de", "2026-09-01", 1)).toEqual(["top-c"]);
  });
});
