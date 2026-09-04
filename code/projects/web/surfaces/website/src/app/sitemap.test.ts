import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { site } from "@/config";

// ── Sentinel queries: dispatch client.fetch by identity, no real GROQ ────────
const Q = {
  pages: "Q_PAGES",
  posts: "Q_POSTS",
  categories: "Q_CATEGORIES",
  tags: "Q_TAGS",
  authors: "Q_AUTHORS",
  series: "Q_SERIES",
} as const;
vi.mock("@/sanity/page-queries", () => ({ sitemapPagesQuery: Q.pages }));
vi.mock("@indiecrafts/modules-web-blog/sanity/queries", () => ({
  allPostSlugsQuery: Q.posts,
  allCategorySlugsQuery: Q.categories,
  allTagSlugsQuery: Q.tags,
  allAuthorSlugsQuery: Q.authors,
  allSeriesSlugsQuery: Q.series,
}));

// Feature flags — the only @/config values the sitemap gates on. Everything
// else (localeCodes, defaultLocale, localePrefix, site, isPageVisible) stays real.
const features = vi.hoisted(() => ({ sitemap: true, blog: true, blogSeries: true }));
vi.mock("@/config", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/config")>();
  return { ...actual, features };
});

// Deterministic per-locale path (real routing is request-scoped, covered separately).
vi.mock("@/i18n/routing", () => ({
  getStaticPathname: (key: string, locale: string) =>
    (locale === "en" ? "" : `/${locale}`) + (key === "/" ? "" : key),
}));

// A controlled route table so the gating rules are exercised in isolation.
const ROUTES = [
  { key: "/", id: "home", slug: "/" },
  { key: "/about", id: "about", slug: "/about" },
  { key: "/secret", id: "secret", slug: "/secret", seo: { noindex: true } },
  {
    key: "/no-robots",
    id: "no-robots",
    slug: "/no-robots",
    seo: { robots: { index: false } },
  },
  { key: "/disabled", id: "disabled", slug: "/disabled", enabled: false },
  { key: "/category", id: "category", slug: "/category" },
];
vi.mock("./routes", () => ({ ROUTES }));

const { getPageSeo } = vi.hoisted(() => ({ getPageSeo: vi.fn() }));
vi.mock("@/lib/seo/site-seo", () => ({ getPageSeo }));

const { getBlogSettings } = vi.hoisted(() => ({ getBlogSettings: vi.fn() }));
vi.mock("@indiecrafts/modules-web-blog/lib/settings", () => ({ getBlogSettings }));

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@indiecrafts/packages-web-sanity/client", () => ({ client: { fetch } }));

const { default: sitemap } = await import("./sitemap");

// Per-query data the mocked client returns; tests mutate before calling sitemap.
const data: Record<string, { slug: string | null; language?: string }[]> = {};

beforeEach(() => {
  features.sitemap = true;
  features.blog = true;
  features.blogSeries = true;
  getPageSeo.mockResolvedValue(undefined);
  getBlogSettings.mockResolvedValue({
    taxonomy: { categories: true, tags: true, authors: true, categoryNav: true },
  });
  data[Q.pages] = [];
  data[Q.posts] = [];
  data[Q.categories] = [];
  data[Q.tags] = [];
  data[Q.authors] = [];
  data[Q.series] = [];
  fetch.mockImplementation((q: string) => Promise.resolve(data[q] ?? []));
});
afterEach(() => vi.clearAllMocks());

const urls = (entries: { url: string }[]) => entries.map((e) => e.url);

describe("sitemap — feature gating", () => {
  it("returns an empty sitemap when features.sitemap is off", async () => {
    features.sitemap = false;
    expect(await sitemap()).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("omits all blog/dynamic entries when features.blog is off", async () => {
    features.blog = false;
    data[Q.posts] = [{ slug: "hello", language: "en" }];
    const out = await sitemap();
    expect(urls(out)).not.toContain(`${site.url}/blog/hello`);
    // Blog slug queries are never fetched when the surface is off.
    expect(fetch).not.toHaveBeenCalledWith(Q.posts);
  });
});

describe("sitemap — static route gating", () => {
  it("includes visible static routes and sets home priority to 1", async () => {
    const out = await sitemap();
    expect(urls(out)).toContain(site.url); // home, key "/" → bare origin
    expect(urls(out)).toContain(`${site.url}/about`);
    expect(out.find((e) => e.url === site.url)?.priority).toBe(1);
    expect(out.find((e) => e.url === `${site.url}/about`)?.priority).toBe(0.7);
  });

  it("excludes noindex / robots-noindex / disabled routes", async () => {
    const out = urls(await sitemap());
    expect(out).not.toContain(`${site.url}/secret`);
    expect(out).not.toContain(`${site.url}/no-robots`);
    expect(out).not.toContain(`${site.url}/disabled`);
  });

  it("emits per-locale hreflang alternates for each static route", async () => {
    const out = await sitemap();
    const about = out.find((e) => e.url === `${site.url}/about`);
    expect(about?.alternates?.languages).toEqual({
      en: `${site.url}/about`,
      fr: `${site.url}/fr/about`,
    });
  });
});

describe("sitemap — per-locale editor noindex", () => {
  it("drops only the hidden locale from a page's alternates", async () => {
    getPageSeo.mockImplementation((id: string, locale: string) =>
      Promise.resolve(id === "about" && locale === "fr" ? { noIndex: true } : undefined),
    );
    const out = await sitemap();
    const about = out.find((e) => e.url === `${site.url}/about`);
    expect(about?.alternates?.languages).toEqual({ en: `${site.url}/about` });
  });

  it("drops the page entirely when every locale is hidden", async () => {
    getPageSeo.mockImplementation((id: string) =>
      Promise.resolve(id === "about" ? { noIndex: true } : undefined),
    );
    expect(urls(await sitemap())).not.toContain(`${site.url}/about`);
  });
});

describe("sitemap — taxonomy index page gating", () => {
  it("drops the taxonomy index page when its editor toggle is off", async () => {
    getBlogSettings.mockResolvedValue({
      taxonomy: { categories: false, tags: true, authors: true, categoryNav: false },
    });
    expect(urls(await sitemap())).not.toContain(`${site.url}/category`);
  });
});

describe("sitemap — generic builder pages (not blog-gated)", () => {
  it("emits one entry per slug with per-locale alternates at priority 0.6", async () => {
    features.blog = false; // proves builder pages are independent of the blog flag
    data[Q.pages] = [
      { slug: "pricing", language: "en" },
      { slug: "pricing", language: "fr" },
    ];
    const out = await sitemap();
    const pricing = out.find((e) => e.url === `${site.url}/pricing`);
    expect(pricing?.priority).toBe(0.6);
    expect(pricing?.alternates?.languages).toEqual({
      en: `${site.url}/pricing`,
      fr: `${site.url}/fr/pricing`,
    });
  });

  it("skips builder pages in an unconfigured locale", async () => {
    data[Q.pages] = [{ slug: "x", language: "de" }];
    expect(urls(await sitemap())).not.toContain(`${site.url}/x`);
  });
});

describe("sitemap — dynamic blog entries", () => {
  it("emits a post entry per slug with locale alternates", async () => {
    data[Q.posts] = [
      { slug: "hello", language: "en" },
      { slug: "hello", language: "fr" },
    ];
    const out = await sitemap();
    const post = out.find((e) => e.url === `${site.url}/blog/hello`);
    expect(post?.alternates?.languages).toEqual({
      en: `${site.url}/blog/hello`,
      fr: `${site.url}/fr/blog/hello`,
    });
  });

  it("gates series entries behind features.blogSeries", async () => {
    data[Q.series] = [{ slug: "s1", language: "en" }];
    expect(urls(await sitemap())).toContain(`${site.url}/blog/series/s1`);

    features.blogSeries = false;
    expect(urls(await sitemap())).not.toContain(`${site.url}/blog/series/s1`);
  });

  it("gates each taxonomy fetch behind its editor toggle", async () => {
    getBlogSettings.mockResolvedValue({
      taxonomy: { categories: false, tags: true, authors: false, categoryNav: false },
    });
    data[Q.tags] = [{ slug: "t1", language: "en" }];
    data[Q.categories] = [{ slug: "c1", language: "en" }];
    const out = urls(await sitemap());
    expect(out).toContain(`${site.url}/blog/tag/t1`);
    expect(out).not.toContain(`${site.url}/blog/category/c1`);
    expect(fetch).not.toHaveBeenCalledWith(Q.categories);
    expect(fetch).not.toHaveBeenCalledWith(Q.authors);
  });
});
