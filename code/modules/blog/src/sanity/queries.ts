import { defineQuery } from "next-sanity";

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
 */

// ─── Fragments ─────────────────────────────────────────────────

const POST_LIST_FRAGMENT = `
  _id,
  title,
  excerpt,
  publishedAt,
  featured,
  language,
  "slug": metadata.slug.current,
  metadata {
    title,
    description,
    noIndex,
    "video": coalesce(videoFile.asset->url, videoUrl),
    videoAutoplay,
    videoControls,
    image { asset->{ url, metadata }, alt },
    llmsSummary
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
  ${SEO_FRAGMENT}
`;

/**
 * Link fragment — resolves the internal/external union into a single
 * `href` string plus the original label. Internal references get
 * `/blog/<slug>`; external URLs pass through. Empty string when nothing
 * is set.
 */
const LINK_FRAGMENT = `
  ...,
  "href": select(
    type == "internal" => "/blog/" + internal->metadata.slug.current,
    type == "external" => external,
    ""
  )
`;

const CTA_FRAGMENT = `
  ...,
  link { ${LINK_FRAGMENT} }
`;

/**
 * Modules fragment — expands every referenced field per module type.
 * `quote-list` dereferences all its quotes (each carries a `language`
 * field, but they're not `$locale`-filtered here); other refs (people)
 * aren't locale-tagged.
 */
const MODULES_FRAGMENT = `
  ...,
  _type == "image" => { asset->{ url }, "alt": coalesce(alt, "") },
  _type == "module.callout" => { cta { ${CTA_FRAGMENT} } },
  _type == "module.card-list" => {
    cards[] { ..., cta { ${CTA_FRAGMENT} } }
  },
  _type == "module.gallery" => {
    images[]{
      _key,
      "url": asset->url,
      "alt": coalesce(alt, ""),
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  _type == "module.person-list" => {
    people[]->{
      _id, name, role, bio,
      image { asset->{ url } },
      social[] { ${LINK_FRAGMENT} }
    }
  },
  _type == "module.quote-list" => {
    "quotes": quotes[]->{
      _id, content, author, role, language,
      image { asset->{ url } }
    }
  },
  _type == "module.blog-post-list" => {
    categories[]->{ _id }
  }
`;

// ─── Queries ───────────────────────────────────────────────────

/**
 * All public posts, locale-filtered.
 *   - `coalesce(language, "en")` so legacy un-tagged docs default to en.
 */
export const allPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_LIST_FRAGMENT}
  }
`);

export const featuredPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && featured == true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_LIST_FRAGMENT}
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post"
    && metadata.slug.current == $slug
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    _id,
    title,
    excerpt,
    publishedAt,
    featured,
    language,
    // Project the body with module-aware reference expansion. Plain
    // PortableText blocks pass through unchanged via the spread; module
    // blocks (module.quote-list, etc.) get their refs dereferenced via
    // MODULES_FRAGMENT. Without this, modules embedded inline render
    // with empty quotes / people.
    body[]{ ${MODULES_FRAGMENT} },
    "slug": metadata.slug.current,
    metadata {
      title,
      description,
      noIndex,
      "video": coalesce(videoFile.asset->url, videoUrl),
      videoAutoplay,
      videoControls,
      image { asset->{ url, metadata }, alt },
      llmsSummary,
      llmsFull
    },
    authors[]->{ name, position, "slug": slug.current, image { asset->{ url } } },
    categories[]->{ _id, title, "slug": slug.current },
    tags[]->{ _id, title, "slug": slug.current },
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
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && _id != $id
    && (count($categoryIds) == 0 || count(categories[@->_id in $categoryIds]) > 0)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
    ${POST_LIST_FRAGMENT}
  }
`);

/**
 * Slugs only, locale-filtered — used by `generateStaticParams`.
 */
export const allPostSlugsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.unpublished != true]{
    "slug": metadata.slug.current,
    "language": coalesce(language, "en")
  }
`);

/** RSS feed — locale-filtered. */
export const rssPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    title,
    publishedAt,
    "slug": metadata.slug.current,
    metadata { title, description, image { asset->{ url } } },
    authors[]->{ name },
    categories[]->{ title }
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
    comments,
    ${SEO_FRAGMENT}
  }
`);

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
      && metadata.noIndex != true
      && metadata.unpublished != true]) > 0
  ] | order(title asc) {
    _id,
    title,
    description,
    "slug": slug.current,
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true])
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
      && metadata.noIndex != true
      && metadata.unpublished != true]),
    ${SEO_FRAGMENT}
  }
`);

/** Posts in a category, locale-filtered — feeds /blog/category/[slug]. */
export const postsByCategorySlugQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && count(categories[@->slug.current == $slug]) > 0]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_LIST_FRAGMENT}
  }
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
    && metadata.noIndex != true
    && metadata.unpublished != true]),
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
      && metadata.noIndex != true
      && metadata.unpublished != true]) > 0
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
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && count(tags[@->slug.current == $slug]) > 0]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_LIST_FRAGMENT}
  }
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
      && metadata.noIndex != true
      && metadata.unpublished != true]) > 0
  ] | order(name asc) {
    ${AUTHOR_FRAGMENT},
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true])
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
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_LIST_FRAGMENT}
  }
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
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && (count($categoryIds) == 0 || count((categories[]._ref)[@ in $categoryIds]) > 0)
    && (!$featuredOnly || featured == true)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
    ${POST_LIST_FRAGMENT}
  }
`);
