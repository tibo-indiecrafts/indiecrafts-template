import { describe, it, expect } from "vitest";
import { articleOpenGraph } from "./article-og";

describe("articleOpenGraph", () => {
  it("maps a full post to og:type=article + article:* fields", () => {
    const og = articleOpenGraph({
      publishedAt: "2026-08-11T14:57:48.787Z",
      updatedAt: "2026-08-25T14:58:15Z",
      authors: [{ name: "Ada Lovelace" }],
      categories: [{ title: "Engineering" }, { title: "Ignored" }],
    });
    expect(og).toEqual({
      type: "article",
      publishedTime: "2026-08-11T14:57:48.787Z",
      modifiedTime: "2026-08-25T14:58:15Z",
      authors: ["Ada Lovelace"],
      section: "Engineering", // first category only
    });
  });

  it("falls back modifiedTime to publishedTime when there's no update", () => {
    const og = articleOpenGraph({ publishedAt: "2026-01-01T00:00:00Z" });
    expect(og.modifiedTime).toBe("2026-01-01T00:00:00Z");
  });

  it("omits authors and section when absent, and drops blank author names", () => {
    const og = articleOpenGraph({
      publishedAt: "2026-01-01T00:00:00Z",
      authors: [{ name: "" }, { name: null }, null],
      categories: [],
    });
    expect(og).not.toHaveProperty("authors");
    expect(og).not.toHaveProperty("section");
    expect(og.type).toBe("article");
  });
});
