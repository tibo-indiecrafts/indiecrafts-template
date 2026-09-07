import type { Locale } from "@indiecrafts/packages-shared-config";
import { localizedPathname } from "@indiecrafts/packages-web-i18n";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
import { FeaturedPosts } from "@indiecrafts/packages-web-ui-components/web/collection/FeaturedPosts";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import type {
  BlogFeaturedModule as BlogFeaturedModuleType,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { blogFeaturedQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { reorderByIds } from "@indiecrafts/modules-web-blog/lib/pin-order";

/**
 * Frontpage "Featured" block — curated (`source === "pinned"`, the editor's
 * picks in order) or automatic (`source === "flag"`, the latest posts marked
 * `featured`). Maps onto the generic `FeaturedPosts` primitive. Renders
 * nothing when there's no matching post.
 */
export async function BlogFeatured({
  module: m,
  locale,
}: {
  module: BlogFeaturedModuleType;
  locale: Locale;
}) {
  const pinnedIds =
    m.source === "pinned"
      ? (m.pinned ?? []).flatMap((p) => (p?._ref ? [p._ref] : []))
      : [];

  const [posts, display] = await Promise.all([
    sanityFetchLive<PostListItem[]>({
      query: blogFeaturedQuery,
      params: {
        locale,
        pinnedIds,
        limit: m.limit ?? 4,
        useFlag: m.source === "flag",
      },
    }),
    getBlogSettings(),
  ]);

  // GROQ only sorts pinned-vs-not (see blogFeaturedQuery) — respect the
  // editor's manual pin order here.
  const ordered = reorderByIds(posts, pinnedIds);

  const cards: PostCardItem[] = ordered.map((post) => ({
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

  if (!cards.length) return null;

  const lead = m.leadCard ? cards[0] : undefined;
  const rest = m.leadCard ? cards.slice(1) : cards;

  return <FeaturedPosts heading={m.title} lead={lead} items={rest} />;
}
