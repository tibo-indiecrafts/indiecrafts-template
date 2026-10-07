/**
 * Resolve a content slug to its other-locale path via the document-i18n links.
 *
 * @see docs/reference/projects/web/website/src/lib/seo/translations.md
 */

import "server-only";

import { notFound, redirect } from "next/navigation";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { localeCodes, localizedPathname, site, isLocale, type Locale } from "@/config";

/**
 * Cross-locale slug resolution for the document-internationalized content types,
 * reading the `translation.metadata` links that `@sanity/document-internationalization`
 * maintains. One home for the three consumers: the locale switcher
 * (`/api/i18n/translated-slug`), a detail page's `hreflang` alternates
 * (`buildMetadata`), and the sitemap. Uses the published `client` (build-safe).
 */

/** Slug field per translated type. `page` slug is the path root. */
export const SLUG_FIELD: Record<string, string> = {
  post: "media.slug.current",
  category: "slug.current",
  tag: "slug.current",
  author: "slug.current",
  series: "slug.current",
  page: "slug.current",
};

/** URL base per translated type (`page` has none — its slug is the path). */
const BASE_PATH: Record<string, string> = {
  post: "/blog",
  category: "/blog/category",
  tag: "/blog/tag",
  author: "/author",
  series: "/blog/series",
  page: "",
};

const pathFor = (type: string, slug: string): `/${string}` =>
  `${BASE_PATH[type]}/${slug}` as `/${string}`;

/**
 * The target-locale path for a detail slug, or `null` when there's no translation.
 * Two reads: find the source doc by (slug, from-locale), then follow its translation
 * set to the `to` locale's slug. Powers `/api/i18n/translated-slug`.
 */
export async function translatedSlugPath(
  type: string,
  slug: string,
  from: string,
  to: string,
): Promise<string | null> {
  const field = SLUG_FIELD[type];
  if (!field || !slug || !from || !to) return null;

  const current = await client.fetch<{ _id: string } | null>(
    `*[_type == $type && ${field} == $slug && coalesce(language, "en") == $from][0]{ _id }`,
    { type, slug, from },
  );
  if (!current?._id) return null;

  const target = await client.fetch<{ slug: string | null } | null>(
    `*[_type == "translation.metadata" && references($id)][0]
       .translations[_key == $to][0].value->{ "slug": ${field} }`,
    { id: current._id, to },
  );
  return target?.slug ? pathFor(type, target.slug) : null;
}

/**
 * The `locale` URL path of a detail slug that only exists in another locale, or
 * `null`. A locale cookie redirects `/blog/<en-slug>` to `/fr/blog/<en-slug>`, where
 * no French doc has that slug; the detail pages redirect here instead of a 404.
 */
export async function translationFallbackPath(
  type: string,
  slug: string,
  locale: Locale,
): Promise<string | null> {
  for (const from of localeCodes) {
    if (from === locale) continue;
    const path = await translatedSlugPath(type, slug, from, locale);
    if (path) return localizedPathname(path as `/${string}`, locale);
  }
  return null;
}

/** A detail page's not-found branch: redirect to the translation when there is one, else 404. */
export async function redirectToTranslation(
  type: string,
  slug: string,
  locale: Locale,
): Promise<never> {
  const path = await translationFallbackPath(type, slug, locale);
  if (path) redirect(path);
  notFound();
}

/**
 * Absolute per-locale URLs for a detail page's REAL translations (from
 * `translation.metadata`), keyed by locale — for `hreflang` / sitemap alternates.
 * Empty when the doc has no translation set (single-locale → the caller
 * self-references). The set already includes the current locale.
 */
export async function translationAlternates(
  type: string,
  slug: string,
  locale: Locale,
): Promise<Record<string, string>> {
  const field = SLUG_FIELD[type];
  if (!field || !slug) return {};

  const current = await client.fetch<{ _id: string } | null>(
    `*[_type == $type && ${field} == $slug && coalesce(language, "en") == $locale][0]{ _id }`,
    { type, slug, locale },
  );
  if (!current?._id) return {};

  const set = await client.fetch<{ lang: string; slug: string | null }[] | null>(
    `*[_type == "translation.metadata" && references($id)][0]
       .translations[]{ "lang": _key, "slug": value->${field} }`,
    { id: current._id },
  );
  if (!set?.length) return {};

  const out: Record<string, string> = {};
  for (const entry of set) {
    if (!entry.slug || !isLocale(entry.lang, localeCodes)) continue;
    out[entry.lang] =
      `${site.url}${localizedPathname(pathFor(type, entry.slug), entry.lang)}`;
  }
  return out;
}
