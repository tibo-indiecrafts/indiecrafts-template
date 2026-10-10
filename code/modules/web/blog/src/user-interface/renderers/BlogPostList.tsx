/**
 * Fetch and render a filtered grid of posts with the shared BlogCard.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogPostList.md
 */
import { getTranslations } from "next-intl/server";
import type {
  BlogPostListModule,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { moduleBlogPostListQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { BlogCard } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogCard";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { toPostCard } from "@indiecrafts/modules-web-blog/lib/post-card";
import { ModuleSection } from "@indiecrafts/packages-web-ui-components/web/layout/ModuleSection";
import { PostLinks } from "./PostLinks";

/**
 * Server component — fetches its own posts using the module's filters
 * (categories / limit / featured) and renders them with the shared
 * `BlogCard` so every post grid on the site looks the same; in a sidebar, a
 * compact `PostLinks` list.
 */
export async function BlogPostList({
  module: m,
  locale,
  compact,
}: {
  module: BlogPostListModule;
  locale: Locale;
  compact?: boolean;
}) {
  // Filter null entries before mapping — GROQ returns null for refs the
  // client can't resolve (deleted / private categories).
  const categoryIds = (m.categories ?? []).flatMap((c) =>
    c?._id ? [c._id] : [],
  );
  const [posts, t, display] = await Promise.all([
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
    getBlogSettings(),
  ]);

  if (compact) {
    return (
      <PostLinks
        title={m.title ?? t("frontpage.latest.heading")}
        items={posts.map((post) => toPostCard(post, locale, display))}
      />
    );
  }

  return (
    <ModuleSection anchor={m.anchor} className="@container">
      {m.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold @2xl:text-3xl @4xl:text-4xl">
            {m.title}
          </h2>
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
        <ul className="mt-10 grid gap-8 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <BlogCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </ModuleSection>
  );
}
