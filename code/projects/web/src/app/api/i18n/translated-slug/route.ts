import { NextResponse, type NextRequest } from "next/server";
import { sanityFetchLive } from "@indiecrafts/sanity/live";

/**
 * Resolve a blog detail slug into its counterpart in another locale, using the
 * `translation.metadata` links created by `@sanity/document-internationalization`.
 *
 * The `LocaleSwitcher` calls this when switching language on a post / category /
 * tag detail page (whose slugs differ per language). Returns the target-locale
 * path, or `{ path: null }` when there's no translation — the switcher then
 * falls back to the blog homepage.
 *
 *   GET /api/i18n/translated-slug?type=post&slug=my-post&from=fr&to=en
 */
const SLUG_FIELD: Record<string, string> = {
  post: "metadata.slug.current",
  category: "slug.current",
  tag: "slug.current",
};
const BASE_PATH: Record<string, string> = {
  post: "/blog",
  category: "/blog/category",
  tag: "/blog/tag",
};

// Slug↔slug is stable content; let the CDN cache each unique query so this
// unauthenticated, twice-reads-Sanity endpoint can't be hammered for amplification.
const CACHE_HEADERS = {
  "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
};
const reply = (path: string | null) =>
  NextResponse.json({ path }, { headers: CACHE_HEADERS });

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "";
  const slug = sp.get("slug") ?? "";
  const to = sp.get("to") ?? "";
  const from = sp.get("from") ?? "";
  const field = SLUG_FIELD[type];
  if (!field || !slug || !to || !from) return reply(null);

  const current = await sanityFetchLive<{ _id: string } | null>({
    query: `*[_type == $type && ${field} == $slug && coalesce(language, "en") == $from][0]{ _id }`,
    params: { type, slug, from },
  });
  if (!current?._id) return reply(null);

  const target = await sanityFetchLive<{ slug: string | null } | null>({
    query: `*[_type == "translation.metadata" && references($id)][0]
       .translations[_key == $to][0].value->{ "slug": ${field} }`,
    params: { id: current._id, to },
  });

  const path = target?.slug ? `${BASE_PATH[type]}/${target.slug}` : null;
  return reply(path);
}
