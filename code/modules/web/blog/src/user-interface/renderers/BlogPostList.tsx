import { getTranslations } from "next-intl/server";
import type {
  BlogPostListModule,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { moduleBlogPostListQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { BlogCard } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogCard";

/**
 * Server component — fetches its own posts using the module's filters
 * (categories / limit / featured) and renders them with the shared
 * `BlogCard` so every post grid on the site looks the same.
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
  const categoryIds = (m.categories ?? []).flatMap((c) =>
    c?._id ? [c._id] : [],
  );
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
    <section
      id={m.anchor}
      className="mx-auto max-w-6xl px-(--gutter) py-8 md:py-12"
    >
      {m.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{m.title}</h2>
          {m.intro ? (
            <p className="text-muted-foreground mt-3">{m.intro}</p>
          ) : null}
        </header>
      ) : null}

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center">
          {t("noPostsModule")}
        </p>
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
