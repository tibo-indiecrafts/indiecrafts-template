import { afterEach, describe, expect, it, vi } from "vitest";

// The helper reads Sanity via the published client; stub it so the tests drive
// the two-step (find doc → follow translation.metadata) lookup directly.
const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@indiecrafts/sanity/client", () => ({ client: { fetch } }));

const { translatedSlugPath, translationAlternates } = await import("./translations");

afterEach(() => vi.clearAllMocks());

describe("translatedSlugPath", () => {
  it("returns null for an unknown type without hitting Sanity", async () => {
    expect(await translatedSlugPath("widget", "x", "en", "fr")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns null when the source doc doesn't exist", async () => {
    fetch.mockResolvedValueOnce(null);
    expect(await translatedSlugPath("post", "x", "en", "fr")).toBeNull();
  });

  it("returns the sibling-locale path when a translation exists", async () => {
    fetch.mockResolvedValueOnce({ _id: "post.en" });
    fetch.mockResolvedValueOnce({ slug: "mon-article" });
    expect(await translatedSlugPath("post", "my-article", "en", "fr")).toBe(
      "/blog/mon-article",
    );
  });

  it("returns null when there's no translation in the target locale", async () => {
    fetch.mockResolvedValueOnce({ _id: "post.en" });
    fetch.mockResolvedValueOnce(null);
    expect(await translatedSlugPath("post", "my-article", "en", "fr")).toBeNull();
  });

  it("uses the per-type base path (author → /author)", async () => {
    fetch.mockResolvedValueOnce({ _id: "author.en" });
    fetch.mockResolvedValueOnce({ slug: "marie" });
    expect(await translatedSlugPath("author", "mary", "en", "fr")).toBe("/author/marie");
  });
});

describe("translationAlternates", () => {
  it("returns {} when the source doc doesn't exist", async () => {
    fetch.mockResolvedValueOnce(null);
    expect(await translationAlternates("post", "x", "en")).toEqual({});
  });

  it("returns {} when the doc has no translation set", async () => {
    fetch.mockResolvedValueOnce({ _id: "post.en" });
    fetch.mockResolvedValueOnce(null);
    expect(await translationAlternates("post", "x", "en")).toEqual({});
  });

  it("maps each real translation to an absolute per-locale URL", async () => {
    fetch.mockResolvedValueOnce({ _id: "post.en" });
    fetch.mockResolvedValueOnce([
      { lang: "en", slug: "hello" },
      { lang: "fr", slug: "bonjour" },
    ]);
    const out = await translationAlternates("post", "hello", "en");
    expect(Object.keys(out).sort()).toEqual(["en", "fr"]);
    expect(out.en).toMatch(/\/blog\/hello$/);
    expect(out.en).not.toMatch(/\/fr\//); // default locale is unprefixed
    expect(out.fr).toMatch(/\/fr\/blog\/bonjour$/);
  });

  it("skips entries with a missing slug or an unconfigured locale", async () => {
    fetch.mockResolvedValueOnce({ _id: "post.en" });
    fetch.mockResolvedValueOnce([
      { lang: "en", slug: "hello" },
      { lang: "fr", slug: null },
      { lang: "de", slug: "hallo" }, // not in the configured locales
    ]);
    const out = await translationAlternates("post", "hello", "en");
    expect(Object.keys(out)).toEqual(["en"]);
  });
});
