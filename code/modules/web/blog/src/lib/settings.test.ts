import { describe, expect, it, vi } from "vitest";

// `blogFlags` (compiled code capabilities) is the other half of the fold; a vi.fn
// lets each test set the flag state. The Sanity client + query graph only matter
// for `getBlogSettings` (not under test here) — stub them so the import is cheap.
const { blogFlags } = vi.hoisted(() => ({
  blogFlags: vi.fn(() => ({
    taxonomy: { categories: true, tags: true, authors: true },
  })),
}));
vi.mock("./config", () => ({ blogFlags }));
vi.mock("@indiecrafts/packages-web-sanity/client", () => ({
  client: { fetch: vi.fn() },
}));
vi.mock("../sanity/queries", () => ({ blogDisplayQuery: "" }));

const { resolveBlogDisplay } = await import("./settings");

// One typed cast keeps the raw editor fixtures terse.
const run = (raw: unknown) =>
  resolveBlogDisplay(raw as Parameters<typeof resolveBlogDisplay>[0]);

describe("resolveBlogDisplay", () => {
  it("null raw + all flags on → everything visible (unset defaults ON)", () => {
    const d = run(null);
    expect(d.taxonomy).toEqual({
      categories: true,
      tags: true,
      authors: true,
      categoryNav: true,
    });
    expect(d.post.date).toBe(true);
    expect(d.frontpage.featuredHero).toBe(true);
    expect(d.cards.excerpt).toBe(true);
  });

  it("a code flag off hides the taxonomy even if the editor toggle is on", () => {
    blogFlags.mockReturnValueOnce({
      taxonomy: { categories: false, tags: true, authors: true },
    });
    expect(run({ taxonomy: { categories: true } }).taxonomy.categories).toBe(
      false,
    );
  });

  it("an editor toggle off hides the taxonomy even if the flag is on", () => {
    const d = run({ taxonomy: { tags: false } });
    expect(d.taxonomy.tags).toBe(false);
    expect(d.taxonomy.categories).toBe(true); // untouched → on
  });

  it("categoryNav: on by default, but needs both categories and its own toggle", () => {
    expect(run(null).taxonomy.categoryNav).toBe(true); // unset → on
    expect(run({ taxonomy: { categoryNav: false } }).taxonomy.categoryNav).toBe(
      false,
    ); // its own toggle off
    expect(run({ taxonomy: { categories: false } }).taxonomy.categoryNav).toBe(
      false,
    ); // categories off → no category bar
  });

  it("categoryNav is off when the categories code flag is off", () => {
    blogFlags.mockReturnValueOnce({
      taxonomy: { categories: false, tags: true, authors: true },
    });
    expect(run(null).taxonomy.categoryNav).toBe(false);
  });

  it("post toggles: explicit false hides, unset defaults on", () => {
    const d = run({ post: { date: false } });
    expect(d.post.date).toBe(false);
    expect(d.post.readingTime).toBe(true);
  });

  it("frontpage + cards toggles fold the same way", () => {
    const d = run({
      frontpage: { featuredHero: false },
      cards: { excerpt: false },
    });
    expect(d.frontpage.featuredHero).toBe(false);
    expect(d.cards.excerpt).toBe(false);
  });
});
