/**
 * Render posts on the same topic as the current post, as a sidebar card.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogRelated.md
 */
import { getTranslations } from "next-intl/server";
import {
  localizedPathname,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import type {
  BlogRelatedModule,
  Post,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { relatedPostsQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { toPostCard } from "@indiecrafts/modules-web-blog/lib/post-card";
import { PostLinks } from "./PostLinks";

/**
 * The `blog-related` card: other posts sharing a category with `post` (the latest posts
 * when it has none), headed "More on <category>" with a link to that category. Nothing
 * outside a post or when no other post exists.
 */
export async function BlogRelated({
  module: m,
  post,
  locale,
}: {
  module: BlogRelatedModule;
  post?: Post;
  locale: Locale;
}) {
  if (!post) return null;
  const categoryIds = (post.categories ?? []).flatMap((c) =>
    c?._id ? [c._id] : [],
  );
  const [posts, display, t] = await Promise.all([
    sanityFetchLive<PostListItem[]>({
      query: relatedPostsQuery,
      params: { locale, id: post._id, categoryIds, limit: m.limit ?? 4 },
    }),
    getBlogSettings(),
    getTranslations({ locale, namespace: "pages.blog" }),
  ]);
  const category = display.taxonomy.categories
    ? post.categories?.[0]
    : undefined;
  return (
    <PostLinks
      title={
        m.title ??
        (category?.title
          ? t("moreOnTopic", { topic: category.title })
          : t("moreReading"))
      }
      items={posts.map((p) => toPostCard(p, locale, display))}
      footer={
        category?.slug
          ? {
              label: t("allInCategory", { category: category.title ?? "" }),
              href: localizedPathname(
                `/blog/category/${category.slug}`,
                locale,
              ),
            }
          : undefined
      }
    />
  );
}
