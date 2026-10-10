import { describe, expect, it } from "vitest";
import type { PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";
import { toPostCard } from "./post-card";

const post = {
  _id: "p1",
  slug: "hello",
  title: "Hello",
  publishedAt: "2026-08-19T10:00:00Z",
  metadata: {
    title: "Hello, SEO",
    description: "A summary",
    image: { asset: { url: "u" } },
  },
  categories: [{ title: "Design" }],
  authors: [{ name: "Ann" }],
} as unknown as PostListItem;

const all = {
  taxonomy: { categories: true, authors: true, tags: true, categoryNav: true },
};

describe("toPostCard", () => {
  it("maps a post to a localized card", () => {
    expect(toPostCard(post, "fr", all)).toMatchObject({
      _key: "p1",
      href: "/fr/blog/hello",
      title: "Hello, SEO",
      image: "u",
      category: "Design",
      author: "Ann",
      excerpt: "A summary",
    });
  });

  it("hides the category and author the editor turned off", () => {
    const card = toPostCard(post, "en", {
      taxonomy: { ...all.taxonomy, categories: false, authors: false },
    });
    expect(card.category).toBeUndefined();
    expect(card.author).toBeUndefined();
  });
});
