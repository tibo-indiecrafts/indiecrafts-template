/**
 * Build a post's sidebar from its resolved cards.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/post/layout/post-sidebar.md
 */
import type { Locale } from "@indiecrafts/packages-shared-config";
import type {
  AnyModule,
  Post,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";

/** A post's sidebar, ready for either post layout. */
export type PostSidebar = {
  /** The cards; `undefined` with none, so the body takes the full width. */
  aside?: React.ReactNode;
  /** The sidebar holds a TOC card and the post has headings: show the TOC above the body on a phone. */
  mobileToc: boolean;
};

/** The sidebar of `post` from its resolved cards (`resolveSidebar`). */
export function postSidebar(
  cards: AnyModule[],
  post: Post,
  locale: Locale,
): PostSidebar {
  const visible = cards.filter((m) => !m.hidden);
  return {
    aside: visible.length ? (
      <Modules modules={visible} context={{ locale, post, sidebar: true }} />
    ) : undefined,
    mobileToc:
      visible.some((m) => m._type === "module.blog-toc") &&
      (post.headings?.length ?? 0) > 0,
  };
}
