import { beforeEach, describe, expect, it, vi } from "vitest";

// route-gate imports ./settings, which pulls the Sanity client — mock it so the
// pure gating logic can be tested without a live dataset.
vi.mock("./settings", () => ({ getBlogSettings: vi.fn() }));

import { isPageVisible, type PageConfig } from "@indiecrafts/config";
import { blogFlags, blogPage, configureBlog, type BlogFlags } from "./config";
import { isBlogRouteEnabled, isCommentsEnabled, isRssEnabled } from "./route-gate";

const FLAGS: BlogFlags = {
  blog: true,
  rss: true,
  comments: true,
  search: true,
  series: true,
  taxonomy: { authors: true, categories: true, tags: true },
};
const BLOG_PAGE: PageConfig = { key: "/blog", id: "blog", slug: "/blog" };

// The app injects the blog's config once at boot; reset it before each test.
beforeEach(() => configureBlog({ flags: FLAGS, blogPage: BLOG_PAGE }));

describe("blog route-gate", () => {
  it("folds the blog feature flag AND the page's own visibility", () => {
    // Matches the single-source-of-truth contract: flag && page.enabled.
    expect(isBlogRouteEnabled(blogPage())).toBe(blogFlags().blog && isPageVisible(blogPage()));
  });

  it("a disabled page entry is never reachable, even with the blog flag on", () => {
    const disabled = { ...blogPage(), enabled: false };
    expect(isBlogRouteEnabled(disabled)).toBe(false);
  });

  it("RSS requires the blog reachable AND the rss flag; comments AND blogComments", () => {
    expect(isRssEnabled()).toBe(isBlogRouteEnabled(blogPage()) && blogFlags().rss);
    expect(isCommentsEnabled()).toBe(blogFlags().blog && blogFlags().comments);
  });

  it("a second app can turn the blog island off via injected flags", () => {
    // Proves the inversion: the module reads the app-injected config, not a
    // central registry — so a different app mounts the blog with a different set.
    configureBlog({ flags: { ...FLAGS, blog: false }, blogPage: BLOG_PAGE });
    expect(isBlogRouteEnabled(blogPage())).toBe(false);
    expect(isRssEnabled()).toBe(false);
  });
});
