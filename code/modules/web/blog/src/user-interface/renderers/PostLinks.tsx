/**
 * Render a block's posts as a compact link list, for a sidebar card.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/PostLinks.md
 */
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import { MoreOnTopic } from "@indiecrafts/packages-web-ui-components/web/collection/MoreOnTopic";

/**
 * The sidebar form of the blog's post blocks (featured, trending, latest, collection): a
 * heading over title + date links. Too narrow for cards, so the content changes, not just
 * its size. Renders nothing with no post.
 */
export function PostLinks({
  title,
  items,
  footer,
}: {
  title: string;
  items: PostCardItem[];
  footer?: { label: string; href: string };
}) {
  return (
    <MoreOnTopic
      title={title}
      footer={footer}
      items={items.map((i) => ({
        _key: i._key,
        title: i.title,
        href: i.href,
        meta: i.date,
      }))}
    />
  );
}
