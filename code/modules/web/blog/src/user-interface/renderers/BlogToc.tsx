/**
 * Render the post's table of contents as a sidebar card.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/BlogToc.md
 */
import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import type {
  BlogTocModule,
  Post,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { Toc } from "@indiecrafts/modules-web-blog/user-interface/post/components/Toc";

/** The `blog-toc` card: the headings of `post`. Nothing outside a post or with no heading. */
export async function BlogToc({
  module: m,
  post,
  locale,
}: {
  module: BlogTocModule;
  post?: Post;
  locale: Locale;
}) {
  if (!post?.headings?.length) return null;
  const t = await getTranslations({ locale, namespace: "pages.blog" });
  return <Toc headings={post.headings} title={m.title ?? t("onThisPage")} />;
}
