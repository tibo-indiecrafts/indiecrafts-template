/**
 * Map a post to the post-card shape every blog block renders.
 *
 * @see docs/reference/modules/web/blog/src/lib/post-card.md
 */
import {
  localizedPathname,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import type {
  BlogDisplay,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * A post as a `PostCardItem`: its localized link, SEO title (else title), cover, first
 * category and first author (each only when the editor shows that taxonomy), date, SEO
 * description as the excerpt, and video.
 */
export function toPostCard(
  post: PostListItem,
  locale: Locale,
  display: Pick<BlogDisplay, "taxonomy">,
): PostCardItem {
  return {
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
    excerpt: post.metadata?.description ?? undefined,
    video: post.metadata?.video ?? undefined,
  };
}
