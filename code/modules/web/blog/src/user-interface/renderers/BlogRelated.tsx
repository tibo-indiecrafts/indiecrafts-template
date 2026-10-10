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
import type {
  BlogRelatedModule,
  Post,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { toPostCard } from "@indiecrafts/modules-web-blog/lib/post-card";
import { PostLinks } from "./PostLinks";

/**
 * The `blog-related` card: up to `limit` of the post's `related` posts (fetched once by
 * the route: same category, else the latest), headed "More on <category>" with a link to
 * that category. Nothing outside a post or with no related post.
 */
export async function BlogRelated({
  module: m,
  post,
  related,
  locale,
}: {
  module: BlogRelatedModule;
  post?: Post;
  related?: PostListItem[];
  locale: Locale;
}) {
  const posts = (related ?? []).slice(0, m.limit ?? 4);
  if (!post || !posts.length) return null;
  const [display, t] = await Promise.all([
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
