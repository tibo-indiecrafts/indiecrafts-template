import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultLocale, localeCodes, seoDefaults, site } from "@/config";

// The three Sanity readers are the only editorial inputs; stub them so each
// test drives the inheritance chain (site defaults → seoDefaults → page-derived
// → page.seo overrides) directly.
const { getPageSeo, getSiteSeo, getSiteSettings } = vi.hoisted(() => ({
  getPageSeo: vi.fn(),
  getSiteSeo: vi.fn(),
  getSiteSettings: vi.fn(),
}));
// Full stub (no importOriginal — the real module loads the Sanity client, which
// asserts NEXT_PUBLIC_SANITY_PROJECT_ID). metadata.ts imports these four names.
vi.mock("@/lib/seo/site-seo", () => ({
  DEFAULT_SITE_NAME: "indiecrafts.dev",
  getPageSeo,
  getSiteSeo,
  getSiteSettings,
}));

// Deterministic per-locale path (real routing is request-scoped + covered by
// routing.test.ts). Home key "/" → "" so canonical is the bare origin per locale.
vi.mock("@/i18n/routing", () => ({
  getStaticPathname: (key: string, locale: string) =>
    (locale === defaultLocale ? "" : `/${locale}`) + (key === "/" ? "" : key),
}));

const { buildMetadata } = await import("./metadata");

const homePage = { key: "/", id: "home", slug: "/" } as never;

beforeEach(() => {
  getPageSeo.mockResolvedValue(undefined);
  getSiteSeo.mockResolvedValue({ llms: { resources: [] } });
  getSiteSettings.mockResolvedValue({ robots: {}, social: {} });
});
afterEach(() => vi.clearAllMocks());

describe("buildMetadata — SEO copy from Sanity", () => {
  it("passes the page's title/description/keywords through to head + og + twitter", async () => {
    getPageSeo.mockResolvedValue({
      title: "Home",
      description: "Welcome",
      keywords: ["a", "b"],
      structuredData: [],
    });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.title).toBe("Home");
    expect(meta.description).toBe("Welcome");
    expect(meta.keywords).toEqual(["a", "b"]);
    expect(meta.openGraph).toMatchObject({ title: "Home", description: "Welcome" });
    expect(meta.twitter).toMatchObject({ title: "Home", description: "Welcome" });
  });

  it("emits no title/description when the doc has no .seo (layout default applies)", async () => {
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.title).toBeUndefined();
    expect(meta.description).toBeUndefined();
  });
});

describe("buildMetadata — og:image precedence", () => {
  it("prefers the page card over the site card and sizes it 1200×630", async () => {
    getPageSeo.mockResolvedValue({ image: "/page.png", structuredData: [] });
    getSiteSeo.mockResolvedValue({ ogImage: "/site.png", llms: { resources: [] } });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.openGraph?.images).toEqual([
      { url: "/page.png", width: 1200, height: 630, alt: undefined },
    ]);
  });

  it("falls back to the locale site card when the page has none", async () => {
    getSiteSeo.mockResolvedValue({ ogImage: "/site.png", llms: { resources: [] } });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.openGraph?.images).toEqual([
      { url: "/site.png", width: 1200, height: 630, alt: undefined },
    ]);
  });

  it("omits og/twitter images entirely when neither card exists", async () => {
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.openGraph?.images).toBeUndefined();
    expect(meta.twitter?.images).toBeUndefined();
  });
});

describe("buildMetadata — canonical precedence", () => {
  it("auto-builds from the page key for the default locale", async () => {
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.alternates?.canonical).toBe(site.url);
  });

  it("lets a Sanity full-URL canonical win over everything", async () => {
    getPageSeo.mockResolvedValue({
      canonical: "https://elsewhere.test/x",
      structuredData: [],
    });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.alternates?.canonical).toBe("https://elsewhere.test/x");
  });

  it("uses an absolute config canonical override", async () => {
    const page = {
      key: "/",
      id: "home",
      slug: "/",
      seo: { canonical: "https://cfg.test/y" },
    } as never;
    const meta = await buildMetadata({ page, locale: "en" });
    expect(meta.alternates?.canonical).toBe("https://cfg.test/y");
  });

  it("self-canonicalizes to the dynamic pathname when given one", async () => {
    const meta = await buildMetadata({
      page: homePage,
      locale: "fr",
      pathname: "/fr/blog/x",
    });
    expect(meta.alternates?.canonical).toBe(`${site.url}/fr/blog/x`);
  });
});

describe("buildMetadata — hreflang alternates", () => {
  it("emits the full locale set + x-default for a static route", async () => {
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    const langs = meta.alternates?.languages as Record<string, string>;
    expect(Object.keys(langs).sort()).toEqual([...localeCodes, "x-default"].sort());
    expect(langs["x-default"]).toBe(`${site.url}`);
    expect(langs.fr).toBe(`${site.url}/fr`);
  });

  it("links only the real translations for a dynamic page", async () => {
    const meta = await buildMetadata({
      page: homePage,
      locale: "en",
      pathname: "/blog/x",
      translations: { en: `${site.url}/blog/x`, fr: `${site.url}/fr/blog/x` },
    });
    const langs = meta.alternates?.languages as Record<string, string>;
    expect(langs.en).toBe(`${site.url}/blog/x`);
    expect(langs.fr).toBe(`${site.url}/fr/blog/x`);
    expect(langs["x-default"]).toBe(`${site.url}/blog/x`);
  });

  it("self-references a dynamic page with no translations", async () => {
    const meta = await buildMetadata({
      page: homePage,
      locale: "fr",
      pathname: "/fr/blog/x",
    });
    const langs = meta.alternates?.languages as Record<string, string>;
    expect(langs.fr).toBe(`${site.url}/fr/blog/x`);
    expect(langs["x-default"]).toBe(`${site.url}/fr/blog/x`);
    expect(langs.en).toBeUndefined();
  });
});

describe("buildMetadata — robots", () => {
  it("returns seoDefaults.robots when indexable + followable", async () => {
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.robots).toEqual(seoDefaults.robots);
  });

  it("drops index + follow when the page is noindex in Sanity", async () => {
    getPageSeo.mockResolvedValue({ noIndex: true, structuredData: [] });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("applies the site-wide robots toggle from settings", async () => {
    getSiteSettings.mockResolvedValue({
      robots: { noindex: true, nofollow: true },
      social: {},
    });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("lets a full config robots override win verbatim", async () => {
    const page = {
      key: "/",
      id: "home",
      slug: "/",
      seo: { robots: { index: true, follow: false } },
    } as never;
    const meta = await buildMetadata({ page, locale: "en" });
    expect(meta.robots).toEqual({ index: true, follow: false });
  });
});

describe("buildMetadata — og/twitter structural defaults", () => {
  it("re-emits siteName, type + alternateLocale on openGraph", async () => {
    getSiteSettings.mockResolvedValue({ robots: {}, social: {}, siteName: "Acme" });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.openGraph).toMatchObject({
      siteName: "Acme",
      type: seoDefaults.openGraph.type,
      locale: "en",
      alternateLocale: localeCodes.filter((l) => l !== "en"),
    });
  });

  it("uses the seoDefaults twitter card + the settings handle", async () => {
    getSiteSettings.mockResolvedValue({ robots: {}, social: { twitter: "@acme" } });
    const meta = await buildMetadata({ page: homePage, locale: "en" });
    expect(meta.twitter).toMatchObject({
      card: seoDefaults.twitter.card,
      site: "@acme",
      creator: "@acme",
    });
  });
});
