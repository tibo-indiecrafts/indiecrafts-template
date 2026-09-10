import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
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

// Drift tripwire: the blog queries hardcode `coalesce(language, "en")` to default legacy
// un-tagged docs to the default locale. If `defaultLocale` ever changes, that literal (in
// ~43 spots here + a few in the app's seo/compliance queries) must change in lockstep. This
// fails first, pointing at the fix, instead of the queries silently mis-defaulting.
describe("GROQ legacy-untagged-doc default", () => {
  it("matches the current defaultLocale", () => {
    const legacy = `coalesce(language, "${defaultLocale}")`;
    for (const q of [postBySlugQuery, allPostsQuery, blogCollectionQuery]) {
      expect(q).toContain(legacy);
    }
  });
});

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

describe("featuredPostsQuery — regression: leaked unpublished/hidden posts (was noIndex-only)", () => {
  const featuredPosts = posts.map((p) => ({ ...p, featured: true }));

  it("returns only the public and createdAt-only featured posts", async () => {
    const result = await run<{ slug: string }[]>(
      featuredPostsQuery,
      featuredPosts,
      { locale: "en" },
    );
    expect(result.map((p) => p.slug)).toEqual(["public", "createdonly"]);
  });

  it("excludes a featured post that is unpublished, hidden, noIndex, or scheduled", async () => {
    const result = await run<{ slug: string }[]>(
      featuredPostsQuery,
      featuredPosts,
      { locale: "en" },
    );
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
 * Structural drift-guard: catches a future regression that drops a public-
 * filter clause even in a case the fixture-based tests above don't happen
 * to cover. Two tiers, matching the two real contracts in `queries.ts`:
 *
 * - **Listing queries** must exclude all three visibility flags — a listing
 *   is exactly where `hideFromDiscovery` is supposed to bite.
 * - **Direct-access queries** (`allPostSlugsQuery` feeds static params,
 *   `taxonomyForLlmsQuery` feeds a taxonomy detail line) are gated by
 *   `noIndex` + `unpublished` only, same as `postBySlugQuery` below —
 *   `hideFromDiscovery` intentionally does NOT gate them: a hidden-from-
 *   discovery doc still resolves by its own URL, it's just dropped from
 *   listings.
 */
describe("public post/taxonomy queries — public-filter clause drift guard", () => {
  const LISTING_QUERIES: [string, string][] = [
    ["allPostsQuery", allPostsQuery],
    ["featuredPostsQuery", featuredPostsQuery],
    ["relatedPostsQuery", relatedPostsQuery],
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
  ];
  const LISTING_CLAUSES = [
    "noIndex",
    "hideFromDiscovery",
    "unpublished",
  ] as const;

  it.each(
    LISTING_QUERIES.flatMap(([name, query]) =>
      LISTING_CLAUSES.map((clause) => [name, query, clause] as const),
    ),
  )("%s contains the seo.%s filter", (_name, query, clause) => {
    expect(query).toContain(clause);
  });

  const DIRECT_ACCESS_QUERIES: [string, string][] = [
    ["allPostSlugsQuery", allPostSlugsQuery],
    ["taxonomyForLlmsQuery", taxonomyForLlmsQuery],
  ];
  const DIRECT_ACCESS_CLAUSES = ["noIndex", "unpublished"] as const;

  it.each(
    DIRECT_ACCESS_QUERIES.flatMap(([name, query]) =>
      DIRECT_ACCESS_CLAUSES.map((clause) => [name, query, clause] as const),
    ),
  )("%s contains the seo.%s filter", (_name, query, clause) => {
    expect(query).toContain(clause);
  });

  it("postBySlugQuery is gated by unpublished only (intentional — direct-URL access, see query docstring)", () => {
    expect(postBySlugQuery).toContain("unpublished");
  });
});
