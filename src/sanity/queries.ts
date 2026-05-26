import { defineQuery } from "next-sanity";

/**
 * GROQ queries — `defineQuery` flags them for future `sanity typegen`
 * without affecting runtime. All read through `metadata.*` (slug, title,
 * description, image, noIndex) so per-post SEO overrides apply
 * everywhere a post is rendered.
 */

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
    categories[]->{ _id, title }
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
