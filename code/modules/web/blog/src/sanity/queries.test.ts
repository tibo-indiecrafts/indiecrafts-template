import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import {
  allPostSlugsQuery,
  allPostsQuery,
  blogCategorySpotlightQuery,
  blogCollectionQuery,
  blogFeaturedQuery,
  blogHeroQuery,
  featuredPostsQuery,
  moduleBlogPostListQuery,
  postBySlugQuery,
  postsByAuthorCountQuery,
  postsByAuthorSlugQuery,
  postsByCategoryCountQuery,
  postsByCategorySlugQuery,
  postsBySeriesCountQuery,
  postsBySeriesSlugQuery,
  postsByTagCountQuery,
  postsByTagSlugQuery,
  relatedPostsQuery,
  rssPostsQuery,
  searchPostsQuery,
  taxonomyForLlmsQuery,
} from "./queries";

/**
 * These queries bake the "public" filter (noIndex / hideFromDiscovery /
 * unpublished / scheduled) directly into GROQ — there's no JS-side
 * predicate to unit test. `groq-js` evaluates the real exported query
 * strings against an in-memory dataset, so a regression that loosens the
 * filter fails here instead of leaking content in production.
 */
const run = async <T>(
  query: string,
  dataset: unknown[],
  params: Record<string, unknown> = {},
): Promise<T> => {
  const tree = parse(query);
  const value = await evaluate(tree, { dataset, params });
  return (await value.get()) as T;
};

const DAY = 1000 * 60 * 60 * 24;
// `now()` resolves at evaluation time (no `timestamp` override), so these
// offsets stay relative to the real clock — "scheduled" is always future.
const iso = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString();

/** One post per public-filter case, per the task's fixture list. */
const posts = [
  {
    _id: "post.public",
    _type: "post",
    language: "en",
    publishedAt: iso(-DAY),
    media: { slug: { current: "public" } },
    seo: {},
  },
  {
    _id: "post.noindex",
    _type: "post",
    language: "en",
    publishedAt: iso(-DAY),
    media: { slug: { current: "noindex" } },
    seo: { noIndex: true },
  },
  {
    _id: "post.hidden",
    _type: "post",
    language: "en",
    publishedAt: iso(-DAY),
    media: { slug: { current: "hidden" } },
    seo: { hideFromDiscovery: true },
  },
  {
    _id: "post.unpublished",
    _type: "post",
    language: "en",
    publishedAt: iso(-DAY),
    media: { slug: { current: "unpublished" } },
    seo: { unpublished: true },
  },
  {
    _id: "post.scheduled",
    _type: "post",
    language: "en",
    publishedAt: iso(DAY),
    media: { slug: { current: "scheduled" } },
    seo: {},
  },
  {
    _id: "post.createdonly",
    _type: "post",
    language: "en",
    _createdAt: iso(-2 * DAY),
    media: { slug: { current: "createdonly" } },
    seo: {},
  },
];

describe("allPostsQuery — the main listing's public filter", () => {
  it("returns only the public post and the createdAt-only post (no publishedAt, past _createdAt)", async () => {
    const result = await run<{ slug: string }[]>(allPostsQuery, posts, {
      locale: "en",
    });
    expect(result.map((p) => p.slug)).toEqual(["public", "createdonly"]);
  });

  it("excludes noIndex, hideFromDiscovery, unpublished, and scheduled posts", async () => {
    const result = await run<{ slug: string }[]>(allPostsQuery, posts, {
      locale: "en",
    });
    const slugs = result.map((p) => p.slug);
    expect(slugs).not.toContain("noindex");
    expect(slugs).not.toContain("hidden");
    expect(slugs).not.toContain("unpublished");
    expect(slugs).not.toContain("scheduled");
  });
});

describe("postBySlugQuery — the direct-URL detail read", () => {
  it("returns the public post by slug", async () => {
    const result = await run<{ slug: string } | null>(postBySlugQuery, posts, {
      slug: "public",
      locale: "en",
    });
    expect(result?.slug).toBe("public");
  });

  it("returns null for an unpublished slug (the one flag this query gates)", async () => {
    const result = await run(postBySlugQuery, posts, {
      slug: "unpublished",
      locale: "en",
    });
    expect(result).toBeNull();
  });

  it("still returns a noIndex post by its direct slug (shareable by URL, per the module's docs)", async () => {
    const result = await run<{ slug: string } | null>(postBySlugQuery, posts, {
      slug: "noindex",
      locale: "en",
    });
    expect(result?.slug).toBe("noindex");
  });
});

/**
 * Structural drift-guard: every public post listing/detail query must keep
 * filtering `seo.noIndex`. This catches a regression that drops the clause
 * even in a case the fixture-based tests above don't happen to cover.
 */
describe("public post queries — noIndex drift guard", () => {
  const NOINDEX_GATED: [string, string][] = [
    ["allPostsQuery", allPostsQuery],
    ["featuredPostsQuery", featuredPostsQuery],
    ["relatedPostsQuery", relatedPostsQuery],
    ["allPostSlugsQuery", allPostSlugsQuery],
    ["rssPostsQuery", rssPostsQuery],
    ["postsBySeriesSlugQuery", postsBySeriesSlugQuery],
    ["postsBySeriesCountQuery", postsBySeriesCountQuery],
    ["searchPostsQuery", searchPostsQuery],
    ["postsByCategorySlugQuery", postsByCategorySlugQuery],
    ["postsByCategoryCountQuery", postsByCategoryCountQuery],
    ["postsByTagSlugQuery", postsByTagSlugQuery],
    ["postsByTagCountQuery", postsByTagCountQuery],
    ["postsByAuthorSlugQuery", postsByAuthorSlugQuery],
    ["postsByAuthorCountQuery", postsByAuthorCountQuery],
    ["moduleBlogPostListQuery", moduleBlogPostListQuery],
    ["blogHeroQuery", blogHeroQuery],
    ["blogFeaturedQuery", blogFeaturedQuery],
    ["blogCategorySpotlightQuery", blogCategorySpotlightQuery],
    ["blogCollectionQuery", blogCollectionQuery],
    ["taxonomyForLlmsQuery", taxonomyForLlmsQuery],
  ];

  it.each(NOINDEX_GATED)(
    "%s contains the seo.noIndex filter",
    (_name, query) => {
      expect(query).toContain("noIndex");
    },
  );

  it("postBySlugQuery is gated by unpublished, not noIndex (intentional — see query docstring)", () => {
    expect(postBySlugQuery).toContain("unpublished");
  });
});
