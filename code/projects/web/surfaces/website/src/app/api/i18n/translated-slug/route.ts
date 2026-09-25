/**
 * Resolve a content slug to its counterpart in another locale.
 *
 * @see docs/reference/projects/web/website/src/app/api/i18n/translated-slug/route.md
 */
import { NextResponse, type NextRequest } from "next/server";
import { translatedSlugPath } from "@/lib/seo/translations";

/**
 * Resolve a content detail slug into its counterpart in another locale, using the
 * `translation.metadata` links from `@sanity/document-internationalization`.
 *
 * The `LocaleSwitcher` calls this when switching language on a post / category /
 * tag / author / series detail page (whose slugs differ per language). Returns the
 * target-locale path, or `{ path: null }` when there's no translation — the switcher
 * then falls back to the target locale's homepage. Resolution lives in
 * `@/lib/seo/translations` (shared with `hreflang` + the sitemap).
 *
 *   GET /api/i18n/translated-slug?type=post&slug=my-post&from=fr&to=en
 */

// Slug↔slug is stable content; let the CDN cache each unique query so this
// unauthenticated, twice-reads-Sanity endpoint can't be hammered for amplification.
const CACHE_HEADERS = {
  "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const path = await translatedSlugPath(
    sp.get("type") ?? "",
    sp.get("slug") ?? "",
    sp.get("from") ?? "",
    sp.get("to") ?? "",
  );
  return NextResponse.json({ path }, { headers: CACHE_HEADERS });
}
