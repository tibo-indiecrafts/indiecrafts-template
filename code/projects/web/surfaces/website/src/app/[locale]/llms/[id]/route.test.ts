import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Only features.llms.pages gates this route; keep the rest of @/config real so
// the real page-markdown builder can read `site`.
const features = vi.hoisted(() => ({ llms: { pages: true } }));
vi.mock("@/config", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/config")>();
  return { ...actual, features };
});

// Deterministic per-locale path (real routing is request-scoped).
vi.mock("@/i18n/routing", () => ({
  getStaticPathname: (key: string, locale: string) =>
    (locale === "en" ? "" : `/${locale}`) + (key === "/" ? "/" : key),
}));

const ROUTES = [
  { key: "/about", id: "about", slug: "/about" },
  { key: "/blog/[slug]", id: "dyn", slug: "/blog/[slug]" },
];
vi.mock("@/app/routes", () => ({ ROUTES }));

const { getPageSeo } = vi.hoisted(() => ({ getPageSeo: vi.fn() }));
vi.mock("@/lib/seo/site-seo", () => ({ getPageSeo }));

const { GET } = await import("./route");

const call = (id: string, locale = "en") =>
  GET(new Request("https://x.dev"), { params: Promise.resolve({ locale, id }) });

beforeEach(() => {
  features.llms.pages = true;
  getPageSeo.mockResolvedValue({ title: "About", description: "Who we are" });
});
afterEach(() => vi.clearAllMocks());

describe("GET /llms/<id>", () => {
  it("404s when the feature is off", async () => {
    features.llms.pages = false;
    expect((await call("about")).status).toBe(404);
  });

  it("404s for an unknown page id", async () => {
    expect((await call("nope")).status).toBe(404);
  });

  it("404s for a dynamic (non-llms) page", async () => {
    expect((await call("dyn")).status).toBe(404);
  });

  it("404s when the editor marked the page noindex", async () => {
    getPageSeo.mockResolvedValue({ noIndex: true });
    expect((await call("about")).status).toBe(404);
  });

  it("renders per-locale markdown for an indexable page", async () => {
    const res = await call("about", "fr");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/markdown");
    const body = await res.text();
    expect(body).toContain("# About");
    expect(body).toContain("Who we are");
    expect(body).toContain("/fr/about");
  });
});
