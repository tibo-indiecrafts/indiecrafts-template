/**
 * Render the frontpage big-hero block from a pinned or latest post.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogHeroModule.md
 */
import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { localizedPathname } from "@indiecrafts/packages-web-i18n";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
import { PostHero } from "@indiecrafts/packages-web-ui-components/web/layout/PostHero";
import type {
  BlogHeroModule as BlogHeroModuleType,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { blogHeroQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";

/**
 * Frontpage "Big Hero" — fetches the editor's pinned post (`source ===
 * "pinned"`) or the latest published one, and maps it onto the generic
 * `PostHero` primitive. Renders nothing when there's no matching post.
 */
export async function BlogHeroModule({
  module: m,
  locale,
}: {
  module: BlogHeroModuleType;
  locale: Locale;
}) {
  const [post, t, display] = await Promise.all([
    sanityFetchLive<PostListItem | null>({
      query: blogHeroQuery,
      params: {
        locale,
        // `null`, never `undefined`: an undefined param is dropped from the request and
        // the query's `$pinnedId` then fails to parse (the page answered 500).
        pinnedId: (m.source === "pinned" && m.pinned?._ref) || null,
      },
    }),
    getTranslations({ locale, namespace: "pages.blog" }),
    getBlogSettings(),
  ]);

  if (!post) return null;

  const categoryRef = post.categories?.[0];
  const showMeta = (m.showMeta ?? true) && display.taxonomy.authors;

  return (
    <PostHero
      href={localizedPathname(`/blog/${post.slug ?? ""}`, locale)}
      title={post.metadata?.title ?? post.title ?? ""}
      excerpt={post.excerpt ?? post.metadata?.description}
      image={post.metadata?.image?.asset?.url}
      lqip={post.metadata?.image?.asset?.metadata?.lqip}
      alt={post.metadata?.image?.alt}
      video={post.metadata?.video}
      category={
        categoryRef?.title && display.taxonomy.categories
          ? {
              title: categoryRef.title,
              href: categoryRef.slug
                ? localizedPathname(
                    `/blog/category/${categoryRef.slug}`,
                    locale,
                  )
                : undefined,
            }
          : undefined
      }
      author={showMeta ? post.authors?.[0]?.name : undefined}
      date={
        showMeta
          ? (formatDate(locale, post.publishedAt) ?? undefined)
          : undefined
      }
      playLabel={t("playVideo")}
    />
  );
}
