import { describe, expect, it, vi } from "vitest";

// route-gate imports ./settings, which pulls the Sanity client — mock it so the
// pure gating logic can be tested without a live dataset.
vi.mock("./settings", () => ({ getBlogSettings: vi.fn() }));

import { features, isPageVisible, pages } from "@indiecrafts/config";
import { isBlogRouteEnabled, isCommentsEnabled, isRssEnabled } from "./route-gate";

describe("blog route-gate", () => {
  it("folds the blog feature flag AND the page's own visibility", () => {
    // Matches the single-source-of-truth contract: flag && page.enabled.
    expect(isBlogRouteEnabled(pages.blog)).toBe(features.blog && isPageVisible(pages.blog));
  });

  it("a disabled page entry is never reachable, even with the blog flag on", () => {
    const disabled = { ...pages.blog, enabled: false };
    expect(isBlogRouteEnabled(disabled)).toBe(false);
  });

  it("RSS requires the blog reachable AND the rss flag; comments AND blogComments", () => {
    expect(isRssEnabled()).toBe(isBlogRouteEnabled(pages.blog) && features.rss);
    expect(isCommentsEnabled()).toBe(features.blog && features.blogComments);
  });
});
