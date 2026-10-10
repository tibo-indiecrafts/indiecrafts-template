/**
 * Render the frontpage trending block from popular posts, falling back to recent.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogTrending.md
 */
import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { SpotlightRow } from "@indiecrafts/packages-web-ui-components/web/collection/SpotlightRow";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import type {
  BlogTrendingModule as BlogTrendingModuleType,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import {
  blogCollectionQuery,
  moduleBlogPostListQuery,
} from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { PostLinks } from "./PostLinks";
import { toPostCard } from "@indiecrafts/modules-web-blog/lib/post-card";
import { getPopularPostIds } from "@indiecrafts/modules-web-blog/lib/popularity";
import {
  mergePinnedWithFallback,
  popularThenLatest,
} from "@indiecrafts/modules-web-blog/lib/pin-order";

/**
 * Frontpage "Trending" block — the most-viewed posts of the last 30 days
 * (`getPopularPostIds`, the api's anonymous view counter; see `lib/popularity.ts`),
 * falling back to most-recent when there are no views yet or the api is down. `count` is a shared cap (like the sibling blocks):
 * the editor's `pinned` posts take precedence, and trending/recent posts
 * fill the rest up to `count`. The block always renders content once any
 * post exists — never blank. Maps onto the generic `SpotlightRow` primitive;
 * no "view all" link.
 */
export async function BlogTrending({
  module: m,
  locale,
  compact,
}: {
  module: BlogTrendingModuleType;
  locale: Locale;
  compact?: boolean;
}) {
  const count = m.count ?? 4;
  const pinnedIds = (m.pinned ?? []).flatMap((p) => (p?._ref ? [p._ref] : []));

  const [popularIds, display, t] = await Promise.all([
    getPopularPostIds(locale, count),
    getBlogSettings(),
    getTranslations({ locale, namespace: "pages.blog" }),
  ]);

  const [pinnedPosts, popularPosts, latestPosts] = await Promise.all([
    pinnedIds.length
      ? sanityFetchLive<PostListItem[]>({
          query: blogCollectionQuery,
          params: { locale, ids: pinnedIds },
        })
      : Promise.resolve([]),
    popularIds.length
      ? sanityFetchLive<PostListItem[]>({
          query: blogCollectionQuery,
          params: { locale, ids: popularIds },
        })
      : Promise.resolve([]),
    sanityFetchLive<PostListItem[]>({
      query: moduleBlogPostListQuery,
      params: { locale, categoryIds: [], limit: count, featuredOnly: false },
    }),
  ]);

  // Most viewed first, the latest posts filling any gap; then the shared cap (mirrors
  // blog-featured / blog-category-spotlight): pinned posts take precedence.
  const ranked = popularThenLatest(popularPosts, popularIds, latestPosts);
  const posts = mergePinnedWithFallback(
    pinnedPosts,
    pinnedIds,
    ranked,
    ranked.map((post) => post._id),
    count,
  );

  const items: PostCardItem[] = posts.map((post) =>
    toPostCard(post, locale, display),
  );

  if (!items.length) return null;

  const heading = m.title ?? t("frontpage.trending.heading");
  if (compact) return <PostLinks title={heading} items={items} />;
  return <SpotlightRow heading={heading} items={items} />;
}
