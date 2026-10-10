/**
 * Render the frontpage collection block as a carousel of pinned posts.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogCollection.md
 */
import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { Carousel } from "@indiecrafts/packages-web-ui-components/web/collection/Carousel";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import type {
  BlogCollectionModule as BlogCollectionModuleType,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { blogCollectionQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { toPostCard } from "@indiecrafts/modules-web-blog/lib/post-card";
import { reorderByIds } from "@indiecrafts/modules-web-blog/lib/pin-order";
import { PostLinks } from "./PostLinks";

/**
 * Frontpage "Collection" block — a pinned, ordered selection of posts shown
 * in a `Carousel`. Pinned-only (no auto/flag source, unlike `blog-featured`).
 * Renders nothing when there's no matching post.
 */
export async function BlogCollection({
  module: m,
  locale,
  compact,
}: {
  module: BlogCollectionModuleType;
  locale: Locale;
  compact?: boolean;
}) {
  const ids = (m.posts ?? []).flatMap((p) => (p?._ref ? [p._ref] : []));

  const [posts, t, display] = await Promise.all([
    sanityFetchLive<PostListItem[]>({
      query: blogCollectionQuery,
      params: { locale, ids },
    }),
    getTranslations({ locale, namespace: "pages.blog" }),
    getBlogSettings(),
  ]);

  // GROQ only filters by `_id in $ids` — respect the editor's manual order here.
  const ordered = reorderByIds(posts, ids);

  const items: PostCardItem[] = ordered.map((post) =>
    toPostCard(post, locale, display),
  );

  if (!items.length) return null;

  if (compact) {
    return (
      <PostLinks
        title={m.title ?? t("frontpage.collection.heading")}
        items={items}
      />
    );
  }
  return (
    <Carousel
      heading={m.title}
      intro={m.intro}
      items={items}
      labels={{
        prev: t("frontpage.carousel.prev"),
        next: t("frontpage.carousel.next"),
        slide: t("frontpage.carousel.slide"),
      }}
    />
  );
}
