/**
 * Render the frontpage featured block from pinned or flagged posts.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogFeatured.md
 */
import { getTranslations } from "next-intl/server";
import {
  localizedPathname,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { FeaturedPosts } from "@indiecrafts/packages-web-ui-components/web/collection/FeaturedPosts";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import type {
  BlogFeaturedModule as BlogFeaturedModuleType,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { blogFeaturedQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { toPostCard } from "@indiecrafts/modules-web-blog/lib/post-card";
import { reorderByIds } from "@indiecrafts/modules-web-blog/lib/pin-order";
import { PostLinks } from "./PostLinks";

/**
 * The "Featured" block, on any page — curated (`source === "pinned"`, the editor's picks
 * in order) or automatic (`source === "flag"`, the latest posts marked `featured`). Maps
 * onto `FeaturedPosts` (`grid` or `editorial`), or a compact `PostLinks` list in a sidebar.
 * Renders nothing when there's no matching post.
 */
export async function BlogFeatured({
  module: m,
  locale,
  compact,
}: {
  module: BlogFeaturedModuleType;
  locale: Locale;
  compact?: boolean;
}) {
  const pinnedIds =
    m.source === "pinned"
      ? (m.pinned ?? []).flatMap((p) => (p?._ref ? [p._ref] : []))
      : [];

  const [posts, display, t] = await Promise.all([
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
    getTranslations({ locale, namespace: "pages.blog" }),
  ]);

  // GROQ only sorts pinned-vs-not (see blogFeaturedQuery) — respect the
  // editor's manual pin order here.
  const ordered = reorderByIds(posts, pinnedIds);

  const cards: PostCardItem[] = ordered.map((post) =>
    toPostCard(post, locale, display),
  );

  if (!cards.length) return null;

  const viewAll = m.viewAll
    ? { label: m.viewAll, href: localizedPathname("/blog", locale) }
    : undefined;
  if (compact) {
    return (
      <PostLinks
        title={m.title ?? t("frontpage.featured.heading")}
        items={cards}
        footer={viewAll}
      />
    );
  }

  // The editorial layout always leads with its first post.
  const leadFirst = m.layout === "editorial" || !!m.leadCard;
  return (
    <FeaturedPosts
      anchor={m.anchor}
      layout={m.layout ?? "grid"}
      eyebrow={m.eyebrow}
      heading={m.title}
      intro={m.intro}
      viewAll={viewAll}
      lead={leadFirst ? cards[0] : undefined}
      items={leadFirst ? cards.slice(1) : cards}
      playLabel={t("playVideo")}
    />
  );
}
