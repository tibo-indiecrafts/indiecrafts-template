import { defineQuery } from "next-sanity";
import { MODULES_FRAGMENT as GENERIC_MODULES_FRAGMENT } from "@indiecrafts/packages-web-page-builder/sanity/queries";

/**
 * GROQ queries — `defineQuery` flags them for future `sanity typegen`
 * without affecting runtime.
 *
 * **Locale filter** — every post / category / tag read filters by
 * `$locale` (authors and nested quote refs stay global). Documents
 * without a `language` field default to "en"
 * (matches the schema's `initialValue`); legacy un-tagged docs default
 * to "en" too, so existing content still appears on /en after the
 * schema change.
 *
 * **No cross-locale fallback — deliberate.** A document that exists only in
 * one language is NOT shown for another locale; the read returns nothing and
 * the route 404s. This is intentional: rendering default-language content
 * under a `/<locale>/…` URL would be an hreflang / duplicate-content problem.
 * (Field-level `localeString` copy DOES fall back to the default — a different,
 * per-field concern. See `pickLocale` in `@indiecrafts/packages-shared-config`.)
 *
 * **Scheduling** — every public *listing/discovery* read adds
 * `coalesce(publishedAt, _createdAt) <= now()`, so a future `publishedAt`
 * keeps a post out of listings, feeds, related, sitemap, and llms until
 * its date passes. `postBySlugQuery` (the direct URL) is intentionally
 * NOT filtered — a scheduled post is shareable/previewable by URL before
 * it goes live; a hard 404-until-date would break draft preview.
 */

// ─── Fragments ─────────────────────────────────────────────────

/**
 * The post-card projection — every listing (all/featured/related/search,
 * series/category/tag/author, `module.blog-post-list`, `module.blog-hero`)
 * shares this one shape. Exported so new blog-hero-style modules reuse it
 * instead of re-declaring the same fields.
 */
export const POST_CARD_PROJECTION = `
  _id,
  title,
  excerpt,
  publishedAt,
  featured,
  language,
  "slug": media.slug.current,
  "metadata": {
    "title": seo.title,
    "description": seo.description,
    "noIndex": seo.noIndex,
    "video": coalesce(media.videoFile.asset->url, media.videoUrl),
    "videoAutoplay": media.videoAutoplay,
    "videoControls": media.videoControls,
    "image": media.image{ asset->{ url, metadata }, alt },
    "llmsSummary": seo.llmsSummary
  },
  authors[]->{
    _id, name, position, "slug": slug.current,
    "bio": pt::text(bio),
    image { asset->{ url } }
  },
  categories[]->{ _id, title, "slug": slug.current },
  tags[]->{ _id, title, "slug": slug.current }
`;

/** Author fragment used by the standalone /author routes. */
/** SEO + visibility override for taxonomy docs (slug-less `seoMeta`). */
const SEO_FRAGMENT = `
  seo {
    noIndex,
    hideFromDiscovery,
    unpublished,
    title,
    description,
    image { asset->{ url, metadata }, alt }
  }
`;

const AUTHOR_FRAGMENT = `
  _id,
  name,
  position,
  "slug": slug.current,
  "bio": pt::text(bio),
  image { asset->{ url } },
  social[]{ platform, url },
  ${SEO_FRAGMENT}
`;

/**
 * Modules fragment — the generic page-builder projection
 * (`@indiecrafts/packages-web-page-builder`) plus the blog-specific `blog-post-list`. Used by
 * post bodies (inline modules) + the blog singleton's `postModules`.
 */
export const MODULES_FRAGMENT = `
  ${GENERIC_MODULES_FRAGMENT},
  _type == "module.blog-post-list" => {
    categories[]->{ _id }
  },
  _type == "module.blog-topic-cards" => {
    cards[]{
      _key,
      title,
      blurb,
      "image": image.asset->url,
      "imageAlt": image.alt,
      target->{ _type, title, "slug": slug.current }
    }
  }
`;

// ─── Queries ───────────────────────────────────────────────────

/**
 * Public listing order — the editor's manual `priority` (desc) first, then
 * newest. `coalesce(priority, 0)` so an unranked post falls through to pure
 * date order. Series listings keep their own `seriesOrder` sort.
 */
const ORDER_BY_PRIORITY = `coalesce(priority, 0) desc, coalesce(publishedAt, _createdAt) desc`;

/**
 * All public posts, locale-filtered.
 *   - `coalesce(language, "en")` so legacy un-tagged docs default to en.
 */
export const allPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(publishedAt, _createdAt) <= now()
    && coalesce(language, "en") == $locale]
  | order(${ORDER_BY_PRIORITY}) {
    ${POST_CARD_PROJECTION}
  }
`);

export const featuredPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && featured == true
    && coalesce(publishedAt, _createdAt) <= now()
    && coalesce(language, "en") == $locale]
  | order(${ORDER_BY_PRIORITY}) {
    ${POST_CARD_PROJECTION}
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post"
    && media.slug.current == $slug
    && seo.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    _id,
    title,
    excerpt,
    publishedAt,
    "updatedAt": _updatedAt,
    featured,
    language,
    // Project the body with module-aware reference expansion. Plain
    // PortableText blocks pass through unchanged via the spread; module
    // blocks (module.quote-list, etc.) get their refs dereferenced via
    // MODULES_FRAGMENT. Without this, modules embedded inline render
    // with empty quotes / people.
    body[]{ ${MODULES_FRAGMENT} },
    "slug": media.slug.current,
    "metadata": {
      "title": seo.title,
      "description": seo.description,
      "noIndex": seo.noIndex,
      "video": coalesce(media.videoFile.asset->url, media.videoUrl),
      "videoAutoplay": media.videoAutoplay,
      "videoControls": media.videoControls,
      "image": media.image{ asset->{ url, metadata }, alt },
      "llmsSummary": seo.llmsSummary,
      "llmsFull": seo.llmsFull
    },
    authors[]->{ name, position, "slug": slug.current, image { asset->{ url } } },
    categories[]->{ _id, title, "slug": slug.current },
    tags[]->{ _id, title, "slug": slug.current },
    series->{
      title,
      "slug": slug.current,
      // Sibling parts, ordered — drives the on-post "Part N of M" nav. Same
      // public filter as the listings so unpublished/scheduled parts drop out.
      "parts": *[_type == "post"
        && references(^._id)
        && defined(media.slug.current)
        && seo.noIndex != true
        && seo.unpublished != true
        && coalesce(publishedAt, _createdAt) <= now()
        && coalesce(language, "en") == $locale]
        | order(coalesce(seriesOrder, 9999) asc, coalesce(publishedAt, _createdAt) asc){
          _id, title, "slug": media.slug.current
        }
    },
    // Derived — keep these in the same shape the components expect.
    "readTime": round(length(string::split(pt::text(body), " ")) / 200),
    "headings": body[style in ["h2", "h3", "h4"]]{
      style,
      "text": pt::text(@)
    }
  }
`);

/**
 * Posts related to the current one — same categories overlap, excludes
 * the current post, locale-filtered, limit 3.
 *
 * `$categoryIds` is the array of `_id`s of the current post's categories.
 * Pass an empty array to disable the filter and just return the latest
 * three posts (still excluding the current one).
 */
export const relatedPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && _id != $id
    && coalesce(publishedAt, _createdAt) <= now()
    && (count($categoryIds) == 0 || count(categories[@->_id in $categoryIds]) > 0)]
  | order(${ORDER_BY_PRIORITY})[0...3] {
    ${POST_CARD_PROJECTION}
  }
`);

/**
 * Slugs only, locale-filtered — used by `generateStaticParams`.
 */
export const allPostSlugsQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.unpublished != true
    && coalesce(publishedAt, _createdAt) <= now()]{
    "slug": media.slug.current,
    "language": coalesce(language, "en")
  }
`);

/** RSS feed — locale-filtered. */
export const rssPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(publishedAt, _createdAt) <= now()
    && coalesce(language, "en") == $locale]
  | order(${ORDER_BY_PRIORITY}) {
    title,
    publishedAt,
    "slug": media.slug.current,
    "metadata": {
      "title": seo.title,
      "description": seo.description,
      "image": media.image{ asset->{ url } }
    },
    authors[]->{ name },
    categories[]->{ title }
  }
`);

// ─── Series queries ───────────────────────────────────────────

export const seriesBySlugQuery = defineQuery(`
  *[_type == "series"
    && slug.current == $slug
    && seo.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    _id,
    title,
    description,
    "slug": slug.current,
    ${SEO_FRAGMENT}
  }
`);

/** Posts in a series — ordered by `seriesOrder` (then date), paginated. */
export const postsBySeriesSlugQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(publishedAt, _createdAt) <= now()
    && coalesce(language, "en") == $locale
    && series->slug.current == $slug]
  | order(coalesce(seriesOrder, 9999) asc, coalesce(publishedAt, _createdAt) asc)[$start...$end] {
    ${POST_CARD_PROJECTION}
  }
`);

/** Total posts in a series (for pagination) — mirrors the listing filter. */
export const postsBySeriesCountQuery = defineQuery(`
  count(*[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && series->slug.current == $slug])
`);

export const allSeriesSlugsQuery = defineQuery(`
  *[_type == "series" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`);

// ─── Search ───────────────────────────────────────────────────

/**
 * Full-text-ish post search — one locale. `$q` is a GROQ `match` pattern
 * (the route appends `*` for a prefix match); it's tested against the
 * title, excerpt, SEO description, and the flattened body text. Same
 * public filter as the listings (noindex / unpublished / scheduled).
 *
 * `match` is prefix + word-boundary only (no ranking, no typo tolerance) —
 * good enough at template scale; swap in Algolia/Orama when a dataset
 * outgrows it.
 */
export const searchPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(publishedAt, _createdAt) <= now()
    && coalesce(language, "en") == $locale
    && (
      title match $q
      || excerpt match $q
      || seo.description match $q
      || pt::text(body) match $q
    )]
  | order(${ORDER_BY_PRIORITY})[0...$limit] {
    ${POST_CARD_PROJECTION}
  }
`);

// ─── Blog singleton + module-driven queries ───────────────────

/**
 * Blog singleton — shared layout across locales. The modules' nested
 * refs (`quote-list` quotes) are dereferenced inside MODULES_FRAGMENT
 * (not `$locale`-filtered).
 */
export const blogSingletonQuery = defineQuery(`
  *[_type == "blog"][0]{
    postModules[]{ ${MODULES_FRAGMENT} },
    frontpageModules[]{ ${MODULES_FRAGMENT} },
    comments,
    ${SEO_FRAGMENT}
  }
`);

/**
 * The editor's display toggles only (`blog.display`) — a tiny read used
 * everywhere the UI, sitemap, and llms endpoints decide what to show.
 * Resolved against the feature flags by `getBlogSettings` (`lib/settings`).
 */
export const blogDisplayQuery = defineQuery(`*[_type == "blog"][0].display`);

// ─── Comments ─────────────────────────────────────────────────

/**
 * Approved comments for one post, oldest first. **Never** projects
 * `authorEmail` — it stays private (moderation only). Unapproved comments are
 * excluded by the `approved == true` filter; this is the ONLY public comment
 * read, so no path can leak pending ones.
 */
export const approvedCommentsQuery = defineQuery(`
  *[_type == "comment" && post._ref == $postId && approved == true]
  | order(coalesce(createdAt, _createdAt) asc) {
    _id,
    authorName,
    body,
    "parentId": parent._ref,
    "createdAt": coalesce(createdAt, _createdAt)
  }
`);

// ─── Category queries ─────────────────────────────────────────

/**
 * All categories that have at least one post in the current locale.
 * Includes `postCount` so the chip/list can show how many articles
 * each one currently has.
 */
export const categoriesForLocaleQuery = defineQuery(`
  *[_type == "category"
    && coalesce(language, "en") == $locale
    && defined(slug.current)
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && seo.noIndex != true
      && seo.unpublished != true]) > 0
  ] | order(title asc) {
    _id,
    title,
    description,
    "slug": slug.current,
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && seo.noIndex != true
      && seo.unpublished != true])
  }
`);

/**
 * Top-level categories (no `parent`) with their sub-categories, for the blog
 * category nav bar. Locale-filtered; hidden/unpublished categories are dropped
 * at both levels. A category with children renders as a dropdown; without, a
 * plain link.
 */
export const categoryNavQuery = defineQuery(`
  *[_type == "category"
    && coalesce(language, "en") == $locale
    && defined(slug.current)
    && !defined(parent)
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
  ] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "children": *[_type == "category"
      && parent._ref == ^._id
      && coalesce(language, "en") == $locale
      && defined(slug.current)
      && seo.hideFromDiscovery != true
      && seo.unpublished != true
    ] | order(title asc) {
      _id,
      title,
      "slug": slug.current
    }
  }
`);

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category"
    && slug.current == $slug
    && seo.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    _id,
    title,
    description,
    "slug": slug.current,
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && seo.noIndex != true
      && seo.unpublished != true]),
    ${SEO_FRAGMENT}
  }
`);

/** Posts in a category, locale-filtered — feeds /blog/category/[slug]. */
export const postsByCategorySlugQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && count(categories[@->slug.current == $slug]) > 0]
  | order(${ORDER_BY_PRIORITY})[$start...$end] {
    ${POST_CARD_PROJECTION}
  }
`);

/** Total posts in a category (for pagination) — mirrors the listing filter. */
export const postsByCategoryCountQuery = defineQuery(`
  count(*[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && count(categories[@->slug.current == $slug]) > 0])
`);

/** Locale-tagged slugs — `generateStaticParams` builds one entry per pair. */
export const allCategorySlugsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`);

// ─── Tag queries ──────────────────────────────────────────────

const TAG_FRAGMENT = `
  _id,
  title,
  description,
  "slug": slug.current,
  "postCount": count(*[_type == "post"
    && references(^._id)
    && coalesce(language, "en") == $locale
    && seo.noIndex != true
    && seo.unpublished != true]),
  ${SEO_FRAGMENT}
`;

export const tagsForLocaleQuery = defineQuery(`
  *[_type == "tag"
    && coalesce(language, "en") == $locale
    && defined(slug.current)
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && seo.noIndex != true
      && seo.unpublished != true]) > 0
  ] | order(title asc) {
    ${TAG_FRAGMENT}
  }
`);

export const tagBySlugQuery = defineQuery(`
  *[_type == "tag"
    && slug.current == $slug
    && seo.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    ${TAG_FRAGMENT}
  }
`);

/** Posts carrying a given tag, locale-filtered — feeds /blog/tag/[slug]. */
export const postsByTagSlugQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && count(tags[@->slug.current == $slug]) > 0]
  | order(${ORDER_BY_PRIORITY})[$start...$end] {
    ${POST_CARD_PROJECTION}
  }
`);

/** Total posts carrying a tag (for pagination) — mirrors the listing filter. */
export const postsByTagCountQuery = defineQuery(`
  count(*[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && count(tags[@->slug.current == $slug]) > 0])
`);

export const allTagSlugsQuery = defineQuery(`
  *[_type == "tag" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`);

// ─── Author queries ───────────────────────────────────────────

/**
 * All authors with at least one post in the given locale. `postCount`
 * lets the listing show "N posts" and lets the home Top Authors block
 * order by activity.
 */
export const authorsForLocaleQuery = defineQuery(`
  *[_type == "author"
    && coalesce(language, "en") == $locale
    && defined(slug.current)
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && seo.noIndex != true
      && seo.unpublished != true]) > 0
  ] | order(name asc) {
    ${AUTHOR_FRAGMENT},
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && seo.noIndex != true
      && seo.unpublished != true])
  }
`);

/**
 * Author document lookup — locale-filtered. Authors are translated
 * (plugin-managed `language`), so each locale has its own author doc with
 * its own slug + bio; the EN/FR versions are linked via `translation.metadata`.
 */
export const authorBySlugQuery = defineQuery(`
  *[_type == "author"
    && slug.current == $slug
    && coalesce(language, "en") == $locale
    && seo.unpublished != true][0]{
    ${AUTHOR_FRAGMENT}
  }
`);

/** Posts by a given author, locale-filtered — feeds /author/[slug]. */
export const postsByAuthorSlugQuery = defineQuery(`
  *[_type == "post"
    && $slug in authors[]->slug.current
    && coalesce(publishedAt, _createdAt) <= now()
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(${ORDER_BY_PRIORITY})[$start...$end] {
    ${POST_CARD_PROJECTION}
  }
`);

/** Total posts by an author (for pagination) — mirrors the listing filter. */
export const postsByAuthorCountQuery = defineQuery(`
  count(*[_type == "post"
    && $slug in authors[]->slug.current
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()])
`);

export const allAuthorSlugsQuery = defineQuery(`
  *[_type == "author" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`);

/**
 * Taxonomy docs (category / tag / author) for the LLM endpoints, one locale.
 * `$type` is the schema name. Excludes noindex + unpublished (mirrors the post
 * llms query). `title` coalesces `title` (category/tag) with `name` (author).
 * `summary`/`full` are the editor's `seo.llmsSummary` / `seo.llmsFull`.
 */
export const taxonomyForLlmsQuery = defineQuery(`
  *[_type == $type && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale]
    | order(coalesce(title, name) asc){
    "slug": slug.current,
    "title": coalesce(title, name),
    "summary": coalesce(seo.llmsSummary, seo.description, description, pt::text(bio)),
    "full": seo.llmsFull
  }
`);

/**
 * Posts feeding a `module.blog-post-list`. Pass `categoryIds` (array of
 * Sanity `_id`s), `limit`, `featuredOnly`, `locale`. `categoryIds` may
 * be empty; `limit` defaults to 100.
 */
export const moduleBlogPostListQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && (count($categoryIds) == 0 || count((categories[]._ref)[@ in $categoryIds]) > 0)
    && coalesce(publishedAt, _createdAt) <= now()
    && (!$featuredOnly || featured == true)]
  | order(${ORDER_BY_PRIORITY})[0...$limit] {
    ${POST_CARD_PROJECTION}
  }
`);

/**
 * The post feeding a `module.blog-hero`. Pass `locale` + `pinnedId` — the
 * editor's pinned post `_id` when `source == "pinned"`, else `undefined` for
 * the latest published post. Same public filter as the other listings
 * (excludes drafts/unpublished/scheduled); `select()` puts the pinned post
 * first when set, otherwise falls through to the normal listing order.
 */
export const blogHeroQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && (!defined($pinnedId) || _id == $pinnedId)]
  | order(select(defined($pinnedId) => 0, 1) asc, ${ORDER_BY_PRIORITY})[0]{
    ${POST_CARD_PROJECTION}
  }
`);

/**
 * Posts feeding a `module.blog-featured`. Pass `locale`, `pinnedIds` (the
 * editor's picks — `_id`s, in order — when `source == "pinned"`, else `[]`),
 * `limit`, and `useFlag` (`source == "flag"`). Same public filter as the
 * other listings; `select()` puts pinned posts first, falling through to the
 * normal listing order for the `featured == true` fill. GROQ can't preserve
 * the editor's exact pin order (only pinned-vs-not), so the renderer
 * re-sorts by `pinnedIds.indexOf(_id)` when `source == "pinned"`.
 */
export const blogFeaturedQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && (_id in $pinnedIds || ($useFlag && featured == true))]
  | order(select(_id in $pinnedIds => 0, 1) asc, ${ORDER_BY_PRIORITY})[0...$limit]{
    ${POST_CARD_PROJECTION}
  }
`);

/**
 * The category + its posts feeding a `module.blog-category-spotlight`. Pass
 * `locale`, `categoryId`, `pinnedIds` (the editor's picks — `_id`s, in
 * order), and `count`. Posts: the editor's pins plus the category's latest,
 * same public filter as the other listings, deduped by the single `||`
 * filter, `select()` puts pins first. GROQ can't preserve the editor's exact
 * pin order (only pinned-vs-not), so the renderer re-sorts by
 * `pinnedIds.indexOf(_id)`. `category` resolves the title/slug the renderer
 * needs for the heading + the "view all" href.
 */
export const blogCategorySpotlightQuery = defineQuery(`
  {
    "category": *[_type == "category" && _id == $categoryId][0]{
      _id, title, "slug": slug.current
    },
    "posts": *[_type == "post"
      && defined(media.slug.current)
      && seo.noIndex != true
      && seo.hideFromDiscovery != true
      && seo.unpublished != true
      && coalesce(language, "en") == $locale
      && coalesce(publishedAt, _createdAt) <= now()
      && (_id in $pinnedIds || $categoryId in categories[]._ref)]
    | order(select(_id in $pinnedIds => 0, 1) asc, ${ORDER_BY_PRIORITY})[0...$count]{
      ${POST_CARD_PROJECTION}
    }
  }
`);

/**
 * Posts feeding a `module.blog-collection`. Pass `locale` and `ids` (the
 * editor's picks — `_id`s, in order). Pinned-only (no auto/flag source, so
 * no `select()` ordering priority to worry about); same public filter as
 * the other listings. GROQ can't preserve the editor's exact order (only
 * set membership), so the renderer re-sorts by `ids.indexOf(_id)`.
 */
export const blogCollectionQuery = defineQuery(`
  *[_type == "post"
    && defined(media.slug.current)
    && seo.noIndex != true
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale
    && coalesce(publishedAt, _createdAt) <= now()
    && _id in $ids]{
    ${POST_CARD_PROJECTION}
  }
`);
