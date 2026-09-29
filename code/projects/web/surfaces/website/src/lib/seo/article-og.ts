/**
 * The `article:*` OpenGraph fields for a blog post — `type: "article"` plus
 * published/modified time, authors, and section, derived from the post's own
 * fields. Pure + structurally-typed so it unit-tests without a Sanity fetch;
 * spread into the post page's `generateMetadata` `openGraph`.
 */

type ArticlePost = {
  publishedAt?: string | null;
  updatedAt?: string | null;
  authors?: ({ name?: string | null } | null)[] | null;
  categories?: ({ title?: string | null } | null)[] | null;
};

export function articleOpenGraph(post: ArticlePost) {
  const authors = post.authors
    ?.map((a) => a?.name)
    .filter((n): n is string => Boolean(n));
  const section = post.categories?.[0]?.title ?? undefined;
  return {
    type: "article" as const,
    publishedTime: post.publishedAt ?? undefined,
    modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
    ...(authors && authors.length ? { authors } : {}),
    ...(section ? { section } : {}),
  };
}
