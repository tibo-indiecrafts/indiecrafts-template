import { afterEach, describe, expect, it, vi } from "vitest";
import { site } from "@indiecrafts/packages-shared-config";

// `llms.ts` fetches via `sanityFetchLive` and gates via `isBlogRouteEnabled` /
// `getBlogSettings` — mock all three so the line-building logic runs without a
// live dataset, matching the blog module's existing mock-by-module convention.
// `@indiecrafts/packages-web-i18n` is mocked too: it re-exports next-intl's
// `createNavigation`, which resolves `next/navigation` in a way Vitest's node
// environment can't — the module isn't under test here, so stub the one
// export `llms.ts` uses with the "en" (default locale, no prefix) behavior.
const { sanityFetchLive, isBlogRouteEnabled, getBlogSettings } = vi.hoisted(
  () => ({
    sanityFetchLive: vi.fn(),
    isBlogRouteEnabled: vi.fn(() => true),
    getBlogSettings: vi.fn(async () => ({
      taxonomy: { categories: true, tags: true, authors: true },
    })),
  }),
);
vi.mock("@indiecrafts/packages-web-sanity/live", () => ({ sanityFetchLive }));
vi.mock("./route-gate", () => ({ isBlogRouteEnabled }));
vi.mock("./settings", () => ({ getBlogSettings }));
vi.mock("@indiecrafts/packages-web-i18n", () => ({
  localizedPathname: (pathname: string) => pathname,
}));

const { getBlogLlmsLines, getTaxonomyLlmsLines } = await import("./llms");

afterEach(() => vi.clearAllMocks());

describe("getBlogLlmsLines", () => {
  it("returns [] when the public blog route is disabled (short-circuit)", async () => {
    isBlogRouteEnabled.mockReturnValueOnce(false);
    expect(await getBlogLlmsLines("en")).toEqual([]);
    expect(sanityFetchLive).not.toHaveBeenCalled();
  });

  it("returns [] when there are no posts", async () => {
    sanityFetchLive.mockResolvedValueOnce([]);
    expect(await getBlogLlmsLines("en")).toEqual([]);
  });

  it("builds markdown lines, preferring llmsSummary over description, collapsing whitespace, and dropping slug-less posts", async () => {
    sanityFetchLive.mockResolvedValueOnce([
      {
        slug: "a",
        title: "Post A",
        metadata: { title: "Post A SEO", llmsSummary: "  Summary   here  " },
      },
      { slug: "b", title: "Post B", metadata: { description: "Desc B" } },
      { slug: "c", title: "Post C" },
      { slug: undefined, title: "No Slug" },
    ]);
    const lines = await getBlogLlmsLines("en");
    expect(lines[0]).toBe("## Blog");
    expect(lines).toContain(
      `- [Post A SEO](${site.url}/blog/a/md): Summary here`,
    );
    expect(lines).toContain(`- [Post B](${site.url}/blog/b/md): Desc B`);
    // No summary/description at all -> plain link, no trailing colon.
    expect(lines).toContain(`- [Post C](${site.url}/blog/c/md)`);
    expect(lines.join("\n")).not.toContain("No Slug");
  });
});

describe("getTaxonomyLlmsLines", () => {
  it("returns [] when the public blog route is disabled (short-circuit)", async () => {
    isBlogRouteEnabled.mockReturnValueOnce(false);
    expect(await getTaxonomyLlmsLines("en")).toEqual([]);
    expect(getBlogSettings).not.toHaveBeenCalled();
  });

  it("skips a taxonomy whose flag is off and one whose result is empty", async () => {
    getBlogSettings.mockResolvedValueOnce({
      taxonomy: { categories: true, tags: false, authors: true },
    });
    sanityFetchLive
      .mockResolvedValueOnce([
        { slug: "news", title: "News", summary: "Latest news" },
      ]) // categories
      .mockResolvedValueOnce([]); // authors (empty -> no heading)

    const lines = await getTaxonomyLlmsLines("en");

    // tags never fetched: the flag gate skips it before the read.
    expect(sanityFetchLive).toHaveBeenCalledTimes(2);
    expect(lines).toContain("## Categories");
    expect(lines).not.toContain("## Tags");
    expect(lines).not.toContain("## Authors");
    expect(lines.join("\n")).toContain(
      `- [News](${site.url}/blog/category/news): Latest news`,
    );
  });

  it("inlines llmsFull under its line only when { full: true }", async () => {
    getBlogSettings.mockResolvedValueOnce({
      taxonomy: { categories: true, tags: false, authors: false },
    });
    sanityFetchLive.mockResolvedValueOnce([
      { slug: "news", title: "News", summary: "Latest", full: "# Full body" },
    ]);
    const lines = await getTaxonomyLlmsLines("en", { full: true });
    expect(lines).toContain("# Full body");
  });

  it("omits llmsFull when full mode is off, even if the item has one", async () => {
    getBlogSettings.mockResolvedValueOnce({
      taxonomy: { categories: true, tags: false, authors: false },
    });
    sanityFetchLive.mockResolvedValueOnce([
      { slug: "news", title: "News", full: "# Full body" },
    ]);
    const lines = await getTaxonomyLlmsLines("en");
    expect(lines.join("\n")).not.toContain("# Full body");
  });
});
