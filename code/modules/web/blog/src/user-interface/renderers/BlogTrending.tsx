import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { localizedPathname } from "@indiecrafts/packages-web-i18n";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
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
import { getPopularPostIds } from "@indiecrafts/modules-web-blog/lib/popularity";

/**
 * Frontpage "Trending" block — the most popular posts (`getPopularPostIds`),
 * falling back to most-recent while Project 1 has no read-count source (see
 * `lib/popularity.ts`). The editor's `pinned` posts always show first, so the
 * block always renders content once any post exists — never blank. Maps onto
 * the generic `SpotlightRow` primitive; no "view all" link.
 */
export async function BlogTrending({
  module: m,
  locale,
}: {
  module: BlogTrendingModuleType;
  locale: Locale;
}) {
  const count = m.count ?? 4;
  const pinnedIds = (m.pinned ?? []).flatMap((p) => (p?._ref ? [p._ref] : []));

  const [popularIds, display, t] = await Promise.all([
    getPopularPostIds(locale, count),
    getBlogSettings(),
    getTranslations({ locale, namespace: "pages.blog" }),
  ]);

  const [pinnedPosts, fallbackPosts] = await Promise.all([
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
      : sanityFetchLive<PostListItem[]>({
          query: moduleBlogPostListQuery,
          params: {
            locale,
            categoryIds: [],
            limit: count,
            featuredOnly: false,
          },
        }),
  ]);

  // GROQ only filters by `_id in $ids` — respect the editor's/popularity's order here.
  const orderedPinned = pinnedIds.length
    ? [...pinnedPosts].sort(
        (a, b) => pinnedIds.indexOf(a._id) - pinnedIds.indexOf(b._id),
      )
    : [];
  const orderedFallback = popularIds.length
    ? [...fallbackPosts].sort(
        (a, b) => popularIds.indexOf(a._id) - popularIds.indexOf(b._id),
      )
    : fallbackPosts;

  const pinnedIdSet = new Set(orderedPinned.map((post) => post._id));
  const posts = [
    ...orderedPinned,
    ...orderedFallback.filter((post) => !pinnedIdSet.has(post._id)),
  ];

  const items: PostCardItem[] = posts.map((post) => ({
    _key: post._id,
    href: localizedPathname(`/blog/${post.slug ?? ""}`, locale),
    title: post.metadata?.title ?? post.title ?? "",
    image: post.metadata?.image?.asset?.url,
    lqip: post.metadata?.image?.asset?.metadata?.lqip,
    category: display.taxonomy.categories
      ? post.categories?.[0]?.title
      : undefined,
    author: display.taxonomy.authors ? post.authors?.[0]?.name : undefined,
    date: formatDate(locale, post.publishedAt) ?? undefined,
  }));

  if (!items.length) return null;

  return (
    <SpotlightRow
      heading={m.title ?? t("frontpage.trending.heading")}
      items={items}
    />
  );
}
