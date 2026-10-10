/**
 * Build a post's sidebar from its resolved cards.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/post/layout/post-sidebar.md
 */
import type { Locale } from "@indiecrafts/packages-shared-config";
import type {
  AnyModule,
  Post,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";

/** A post's sidebar, ready for either post layout. */
export type PostSidebar = {
  /** The cards; `undefined` with none, so the body takes the full width. */
  aside?: React.ReactNode;
  /** The sidebar holds a TOC card and the post has headings: show the TOC above the body on a phone. */
  mobileToc: boolean;
};

/**
 * The sidebar of `post` from its resolved cards (`resolveSidebar`, hidden ones already
 * dropped in GROQ) and its `related` posts. The TOC card goes when the post has no
 * heading, the related card when there is no related post: an empty card must not keep
 * an empty column.
 */
export function postSidebar(
  cards: AnyModule[],
  post: Post,
  locale: Locale,
  related: PostListItem[],
): PostSidebar {
  const hasHeadings = (post.headings?.length ?? 0) > 0;
  const shown = cards.filter(
    (m) =>
      (m._type !== "module.blog-toc" || hasHeadings) &&
      (m._type !== "module.blog-related" || related.length > 0),
  );
  return {
    aside: shown.length ? (
      <Modules
        modules={shown}
        context={{ locale, post, related, sidebar: true }}
      />
    ) : undefined,
    mobileToc: hasHeadings && shown.some((m) => m._type === "module.blog-toc"),
  };
}
