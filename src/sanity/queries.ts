import { defineQuery } from "next-sanity";

/**
 * GROQ queries — `defineQuery` flags them for future `sanity typegen`
 * without affecting runtime.
 *
 * **Locale filter** — every post / category / quote read filters by
 * `$locale`. Documents without a `language` field default to "en"
 * (matches the schema's `initialValue`); legacy un-tagged docs default
 * to "en" too, so existing content still appears on /en after the
 * schema change.
 */

// ─── Fragments ─────────────────────────────────────────────────

const POST_LIST_FRAGMENT = `
  _id,
  title,
  publishedAt,
  featured,
  language,
  "slug": metadata.slug.current,
  metadata {
    title,
    description,
    noIndex,
    image { asset->{ url, metadata }, alt }
  },
  author->{ name, "slug": slug.current, image { asset->{ url } } },
  categories[]->{ _id, title }
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
 * `quote-list` filters its quotes by `$locale`; other refs (logos,
 * people, forms) aren't locale-tagged.
 */
const MODULES_FRAGMENT = `
  ...,
  _type == "module.callout" => { cta { ${CTA_FRAGMENT} } },
  _type == "module.hero-split" => {
    ctas[] { ${CTA_FRAGMENT} }
  },
  _type == "module.card-list" => {
    cards[] { ..., cta { ${CTA_FRAGMENT} } }
  },
  _type == "module.logo-list" => {
    logos[]->{ _id, name, url, image { asset->{ url } } }
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
    }[coalesce(language, "en") == $locale]
  },
  _type == "module.form" => {
    form->{
      _id, name, title, intro, submitLabel,
      fields[]
    }
  },
  _type == "module.blog-post-list" => {
    categories[]->{ _id, title }
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
    && coalesce(language, "en") == $locale][0]{
    _id,
    title,
    publishedAt,
    featured,
    language,
    body,
    "slug": metadata.slug.current,
    metadata {
      title,
      description,
      noIndex,
      image { asset->{ url, metadata }, alt }
    },
    author->{ name, position, "slug": slug.current, image { asset->{ url } } },
    categories[]->{ _id, title },
    // Derived — keep these in the same shape the components expect.
    "readTime": round(length(string::split(pt::text(body), " ")) / 200),
    "headings": body[style in ["h2", "h3", "h4"]]{
      style,
      "text": pt::text(@)
    }
  }
`);

/**
 * Slugs only, locale-filtered — used by `generateStaticParams`.
 */
export const allPostSlugsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true]{
    "slug": metadata.slug.current,
    "language": coalesce(language, "en")
  }
`);

/** RSS feed — locale-filtered. */
export const rssPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    title,
    publishedAt,
    "slug": metadata.slug.current,
    metadata { title, description, image { asset->{ url } } },
    author->{ name },
    categories[]->{ title }
  }
`);

// ─── Blog singleton + module-driven queries ───────────────────

/**
 * Blog singleton — shared layout across locales. The modules' nested
 * refs (`quote-list` quotes) filter by `$locale` inside MODULES_FRAGMENT.
 */
export const blogSingletonQuery = defineQuery(`
  *[_type == "blog"][0]{
    frontpageModules[]{ ${MODULES_FRAGMENT} },
    postModules[]{ ${MODULES_FRAGMENT} }
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
    && coalesce(language, "en") == $locale
    && (count($categoryIds) == 0 || count((categories[]._ref)[@ in $categoryIds]) > 0)
    && (!$featuredOnly || featured == true)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
    ${POST_LIST_FRAGMENT}
  }
`);
