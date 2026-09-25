/**
 * Render the frontpage category-spotlight block from pins plus latest category posts.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogCategorySpotlight.md
 */
import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { localizedPathname } from "@indiecrafts/packages-web-i18n";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
import { SpotlightRow } from "@indiecrafts/packages-web-ui-components/web/collection/SpotlightRow";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import type {
  BlogCategorySpotlightModule as BlogCategorySpotlightModuleType,
  CategoryRef,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { blogCategorySpotlightQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { reorderByIds } from "@indiecrafts/modules-web-blog/lib/pin-order";

/**
 * Frontpage "Category Spotlight" block — the editor's pins plus the latest
 * posts from one category. Maps onto the generic `SpotlightRow` primitive;
 * the heading is always the category's title. Renders nothing when the
 * category is missing or there's no matching post.
 */
export async function BlogCategorySpotlight({
  module: m,
  locale,
}: {
  module: BlogCategorySpotlightModuleType;
  locale: Locale;
}) {
  const pinnedIds = (m.pinned ?? []).flatMap((p) => (p?._ref ? [p._ref] : []));

  const [{ category, posts }, display, t] = await Promise.all([
    sanityFetchLive<{ category: CategoryRef | null; posts: PostListItem[] }>({
      query: blogCategorySpotlightQuery,
      params: {
        locale,
        categoryId: m.category?._ref ?? "",
        pinnedIds,
        count: m.count ?? 4,
      },
    }),
    getBlogSettings(),
    getTranslations({ locale, namespace: "pages.blog" }),
  ]);

  if (!category) return null;

  // GROQ only sorts pinned-vs-not (see blogCategorySpotlightQuery) — respect
  // the editor's manual pin order here.
  const ordered = reorderByIds(posts, pinnedIds);

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
    <SpotlightRow
      heading={m.heading ?? category.title ?? ""}
      subheading={m.subheading}
      items={items}
      viewAll={{
        label: t("allInCategory", { category: category.title ?? "" }),
        href: localizedPathname(
          `/blog/category/${category.slug ?? ""}`,
          locale,
        ),
      }}
    />
  );
}
