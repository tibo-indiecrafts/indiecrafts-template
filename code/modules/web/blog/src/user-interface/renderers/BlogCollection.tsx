import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { localizedPathname } from "@indiecrafts/packages-web-i18n";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
import { Carousel } from "@indiecrafts/packages-web-ui-components/web/collection/Carousel";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import type {
  BlogCollectionModule as BlogCollectionModuleType,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { blogCollectionQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { reorderByIds } from "@indiecrafts/modules-web-blog/lib/pin-order";

/**
 * Frontpage "Collection" block — a pinned, ordered selection of posts shown
 * in a `Carousel`. Pinned-only (no auto/flag source, unlike `blog-featured`).
 * Renders nothing when there's no matching post.
 */
export async function BlogCollection({
  module: m,
  locale,
}: {
  module: BlogCollectionModuleType;
  locale: Locale;
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

  const items: PostCardItem[] = ordered.map((post) => ({
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
