import { describe, expect, it } from "vitest";
import { pageCount, pageRange, parsePage, POSTS_PER_PAGE } from "./pagination";

describe("parsePage", () => {
  it("parses a valid page number", () => {
    expect(parsePage("3")).toBe(3);
  });

  it("takes the first element of an array value", () => {
    expect(parsePage(["4", "5"])).toBe(4);
  });

  it("falls back to 1 for page 1 (n > 1 is the valid range)", () => {
    expect(parsePage("1")).toBe(1);
  });

  it("falls back to 1 for 0", () => {
    expect(parsePage("0")).toBe(1);
  });

  it("falls back to 1 for a negative number", () => {
    expect(parsePage("-5")).toBe(1);
  });

  it("falls back to 1 for a non-numeric string", () => {
    expect(parsePage("abc")).toBe(1);
  });

  it("falls back to 1 for a non-integer", () => {
    expect(parsePage("3.5")).toBe(1);
  });

  it("falls back to 1 for undefined", () => {
    expect(parsePage(undefined)).toBe(1);
  });
});

describe("pageRange", () => {
  it("page 1 starts at 0", () => {
    expect(pageRange(1)).toEqual({ start: 0, end: POSTS_PER_PAGE });
  });

  it("page 2 offsets by one page", () => {
    expect(pageRange(2)).toEqual({
      start: POSTS_PER_PAGE,
      end: POSTS_PER_PAGE * 2,
    });
  });

  it("page 3 offsets by two pages", () => {
    expect(pageRange(3)).toEqual({
      start: POSTS_PER_PAGE * 2,
      end: POSTS_PER_PAGE * 3,
    });
  });
});

describe("pageCount", () => {
  it("an exact multiple of the page size divides evenly", () => {
    expect(pageCount(POSTS_PER_PAGE * 2)).toBe(2);
  });

  it("a remainder rounds up to one more page", () => {
    expect(pageCount(POSTS_PER_PAGE * 2 + 1)).toBe(3);
  });

  it("zero total is still 1 page (never below 1)", () => {
    expect(pageCount(0)).toBe(1);
  });
});
