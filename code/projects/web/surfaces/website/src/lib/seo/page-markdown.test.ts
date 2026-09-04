import { describe, expect, it, vi } from "vitest";

// getStaticPathname wraps next-intl's request-scoped routing; stub it to a
// deterministic per-locale path so the markdown builders can be exercised for
// any page key without a live routing context.
vi.mock("@/i18n/routing", () => ({
  getStaticPathname: (key: string, locale: string) =>
    (locale === "en" ? "" : `/${locale}`) + (key === "/" ? "/" : key),
}));

const { isLlmsPage, renderPageMarkdown, renderAllPagesMarkdown } =
  await import("./page-markdown");

// Minimal PageConfig factory — only the fields the builders read.
const page = (over: Record<string, unknown> = {}) => ({
  key: "/about",
  id: "about",
  slug: "/about",
  ...over,
});

describe("isLlmsPage — the single inclusion gate", () => {
  it("includes a plain enabled indexable static route", () => {
    expect(isLlmsPage(page() as never)).toBe(true);
  });

  it("excludes dynamic routes (a `[param]` in the key)", () => {
    expect(isLlmsPage(page({ key: "/blog/[slug]" }) as never)).toBe(false);
  });

  it("excludes a disabled page", () => {
    expect(isLlmsPage(page({ enabled: false }) as never)).toBe(false);
  });

  it("excludes a noindex page automatically", () => {
    expect(isLlmsPage(page({ seo: { noindex: true } }) as never)).toBe(false);
  });

  it("excludes a page that opts out with `seo.llms: false`", () => {
    expect(isLlmsPage(page({ seo: { llms: false } }) as never)).toBe(false);
  });
});

describe("renderPageMarkdown — per-locale page dump", () => {
  it("builds a per-locale absolute URL from the page key", () => {
    const en = renderPageMarkdown(page() as never, "en", { title: "About" });
    const fr = renderPageMarkdown(page() as never, "fr", { title: "À propos" });
    expect(en).toContain("URL: ");
    expect(en).toContain("/about");
    expect(en).not.toContain("/fr/about");
    expect(fr).toContain("/fr/about");
  });

  it("uses the Sanity title, falling back to the page id when absent", () => {
    expect(renderPageMarkdown(page() as never, "en", { title: "About" })).toContain(
      "# About",
    );
    expect(renderPageMarkdown(page() as never, "en", undefined)).toContain("# about");
  });

  it("appends the description and the editor `llmsFull` body when present", () => {
    const md = renderPageMarkdown(page() as never, "en", {
      title: "About",
      description: "Who we are",
      llmsFull: "## History\nFounded in 2020.",
    });
    expect(md).toContain("Who we are");
    expect(md).toContain("## History");
  });

  it("emits head-only markdown when there is no description or body", () => {
    const md = renderPageMarkdown(page() as never, "en", { title: "About" });
    expect(md).toContain("# About");
    expect(md).toContain("URL: ");
    expect(md).not.toContain("undefined");
  });
});

describe("renderAllPagesMarkdown — concatenated full dump", () => {
  it("joins every page's markdown with a `---` separator", () => {
    const pages = [page({ id: "a", key: "/a" }), page({ id: "b", key: "/b" })];
    const seo = new Map([
      ["a", { title: "Alpha" }],
      ["b", { title: "Bravo" }],
    ]);
    const md = renderAllPagesMarkdown(pages as never, "en", seo);
    expect(md).toContain("# Alpha");
    expect(md).toContain("# Bravo");
    expect(md).toContain("\n---\n");
  });
});
