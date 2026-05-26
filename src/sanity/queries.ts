import { defineQuery } from "next-sanity";

/**
 * GROQ queries — co-located so the Studio's TS support and any future
 * `sanity typegen` step can find them.
 *
 * `defineQuery` is a no-op tagged template that flags the string for
 * tooling without changing runtime behaviour.
 */

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc)
  {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage { asset->{ url, metadata }, alt },
    author->{ name, "slug": slug.current, image { asset->{ url } } },
    categories[]->{ _id, title }
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    body,
    mainImage { asset->{ url, metadata }, alt },
    author->{ name, position, "slug": slug.current, image { asset->{ url } } },
    categories[]->{ _id, title }
  }
`);

export const allPostSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);
