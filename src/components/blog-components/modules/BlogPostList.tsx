import { getTranslations } from "next-intl/server";
import type { BlogPostListModule, PostListItem } from "@/sanity/types";
import type { Locale } from "@/config";
import { sanityFetchLive } from "@/sanity/live";
import { moduleBlogPostListQuery } from "@/sanity/queries";
import { BlogCard } from "@/components/blog-components/BlogCard";

/**
 * Server component — fetches its own posts using the module's filters
 * (categories / limit / featured) and renders them with the shared
 * `BlogCard` so every post grid on the site looks the same.
 *
 * The `data-search-title` attribute used by `module.search` is set by
 * `BlogCard` itself, so search-as-you-type still works inside this list.
 */
export async function BlogPostList({
  module: m,
  locale,
}: {
  module: BlogPostListModule;
  locale: Locale;
}) {
  // Filter null entries before mapping — GROQ returns null for refs the
  // client can't resolve (deleted / private categories).
  const categoryIds = (m.categories ?? [])
    .filter((c): c is NonNullable<typeof c> => c != null)
    .map((c) => c._id)
    .filter(Boolean);
  const [posts, t] = await Promise.all([
    sanityFetchLive<PostListItem[]>({
      query: moduleBlogPostListQuery,
      params: {
        locale,
        categoryIds,
        limit: m.limit ?? 100,
        featuredOnly: m.featuredOnly ?? false,
      },
    }),
    getTranslations({ locale, namespace: "pages.blog" }),
  ]);

  return (
    <section id={m.anchor} className="mx-auto max-w-6xl px-(--gutter) py-12 md:py-20">
      {m.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{m.title}</h2>
          {m.intro ? <p className="text-muted-foreground mt-3">{m.intro}</p> : null}
        </header>
      ) : null}

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center">{t("noPostsModule")}</p>
      ) : (
        <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <BlogCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
