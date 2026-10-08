import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchLive = vi.fn(async () => null);
vi.mock("@indiecrafts/packages-web-sanity/live", () => ({
  sanityFetchLive: fetchLive,
}));
vi.mock("next-intl/server", () => ({
  getTranslations: async () => (k: string) => k,
}));
vi.mock("@indiecrafts/packages-web-i18n", () => ({
  localizedPathname: (p: string) => p,
}));
vi.mock("@indiecrafts/packages-web-ui-components/web/layout/PostHero", () => ({
  PostHero: () => null,
}));
vi.mock("@indiecrafts/modules-web-blog/lib/settings", () => ({
  getBlogSettings: async () => ({ taxonomy: { authors: true } }),
}));

const { BlogHeroModule } = await import("./BlogHeroModule");

beforeEach(() => fetchLive.mockClear());

/** The `pinnedId` the hero sent to Sanity. */
const sentPinnedId = () =>
  (
    fetchLive.mock.calls[0] as unknown as [{ params: Record<string, unknown> }]
  )[0].params.pinnedId;

describe("BlogHeroModule", () => {
  // An `undefined` param is dropped from the request, and the query's `$pinnedId` then
  // fails to parse: `/blog` answered 500.
  it("sends pinnedId null (never undefined) for the latest post", async () => {
    await BlogHeroModule({
      module: { source: "latest" } as never,
      locale: "en",
    });
    expect(sentPinnedId()).toBeNull();
  });

  it("sends pinnedId null when 'pinned' has no post picked", async () => {
    await BlogHeroModule({
      module: { source: "pinned" } as never,
      locale: "en",
    });
    expect(sentPinnedId()).toBeNull();
  });

  it("sends the pinned post's id", async () => {
    await BlogHeroModule({
      module: { source: "pinned", pinned: { _ref: "post-1" } } as never,
      locale: "en",
    });
    expect(sentPinnedId()).toBe("post-1");
  });
});
