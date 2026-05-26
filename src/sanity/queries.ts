import { defineQuery } from "next-sanity";

/**
 * GROQ queries — `defineQuery` flags them for future `sanity typegen`
 * without affecting runtime. All read through `metadata.*` (slug, title,
 * description, image, noIndex) so per-post SEO overrides apply
 * everywhere a post is rendered.
 */

// ─── Fragments ─────────────────────────────────────────────────

const POST_LIST_FRAGMENT = `
  _id,
  title,
  publishedAt,
  featured,
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
 * Add a new module here when adding a new schema; the renderer switches
 * on `_type`.
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
    quotes[]->{ _id, content, author, role, image { asset->{ url } } }
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

export const allPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_LIST_FRAGMENT}
  }
`);

export const featuredPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && featured == true]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_LIST_FRAGMENT}
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && metadata.slug.current == $slug][0]{
    _id,
    title,
    publishedAt,
    featured,
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
 * Slugs only — used by `generateStaticParams`. Honors `noIndex` so
 * hidden posts don't get statically generated either.
 */
export const allPostSlugsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true]{
    "slug": metadata.slug.current
  }
`);

/** RSS feed — all visible posts with the fields the feed needs. */
export const rssPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true]
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
 * Blog singleton — owns the layout for /blog + /blog/[slug] when
 * editors compose modules. Returns null when no `blog` document exists.
 */
export const blogSingletonQuery = defineQuery(`
  *[_type == "blog"][0]{
    frontpageModules[]{ ${MODULES_FRAGMENT} },
    postModules[]{ ${MODULES_FRAGMENT} }
  }
`);

/**
 * Posts feeding a `module.blog-post-list`. Pass `categoryIds` (array of
 * Sanity `_id`s) and `limit` (positive integer). `categoryIds` may be an
 * empty array when no filter is set; `limit` defaults to 100 — set
 * higher to fetch more.
 */
export const moduleBlogPostListQuery = defineQuery(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && (count($categoryIds) == 0 || count((categories[]._ref)[@ in $categoryIds]) > 0)
    && (!$featuredOnly || featured == true)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
    ${POST_LIST_FRAGMENT}
  }
`);
