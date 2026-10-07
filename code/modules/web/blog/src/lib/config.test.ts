import { describe, expect, it, vi } from "vitest";

const off = {
  blog: false,
  rss: false,
  comments: false,
  search: false,
  series: false,
  taxonomy: { authors: false, categories: false, tags: false },
};

describe("configureBlog", () => {
  // Next bundles instrumentation.ts apart from the routes, so each gets its own copy
  // of this module. The app's flags must reach every copy, not only the one it called.
  it("reaches a second copy of the module", async () => {
    const first = await import("./config");
    first.configureBlog({
      flags: off,
      blogPage: { key: "/blog", id: "blog", slug: "/blog", enabled: false },
    });
    vi.resetModules();
    const second = await import("./config");
    expect(second.blogFlags()).toEqual(off);
    expect(second.blogPage().enabled).toBe(false);
  });
});
