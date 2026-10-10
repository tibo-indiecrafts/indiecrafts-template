/**
 * Dispatch blog-specific and generic page-builder modules for the blog.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/renderers/ModuleRenderer.md
 */
import type {
  AnyModule,
  Post,
} from "@indiecrafts/modules-web-blog/sanity/types";
import type { BlockModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { Fragment } from "react";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { renderBlock } from "@indiecrafts/packages-web-ui-components/web/registry";
import { portableComponents } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";
import { SidebarCard } from "@indiecrafts/packages-web-ui-components/web/layout/SidebarCard";
import type { PostSidebar } from "@indiecrafts/modules-web-blog/user-interface/post/layout/post-sidebar";
import { BlogCategorySpotlight } from "./BlogCategorySpotlight";
import { BlogCollection } from "./BlogCollection";
import { BlogExplore } from "./BlogExplore";
import { BlogFeatured } from "./BlogFeatured";
import { BlogHeroModule } from "./BlogHeroModule";
import { BlogIndex } from "./BlogIndex";
import { BlogPostContent } from "./BlogPostContent";
import { BlogPostList } from "./BlogPostList";
import { BlogRelated } from "./BlogRelated";
import { BlogToc } from "./BlogToc";
import { BlogTopicCards } from "./BlogTopicCards";
import { BlogTrending } from "./BlogTrending";

/**
 * Drives every block list that can hold blog blocks: the blog's frontpage and post
 * layouts, site pages, the home page and the sidebar. The blog blocks (which fetch and
 * render live posts) are special-cased here; every other module is a generic **block**
 * rendered by `@indiecrafts/packages-web-ui-components` via `renderBlock`.
 *
 * `context.sidebar` renders the list as sidebar cards: each block in a `SidebarCard`,
 * generic blocks `inline`, the post lists as compact link lists.
 *
 * Returns `null` for the empty-array case — callers (the routes) fall back to
 * their hard-coded default layout when `modules.length === 0`.
 */
export type ModuleContext = {
  locale: Locale;
  post?: Post;
  /** Render the list as sidebar cards. */
  sidebar?: boolean;
  /** The post's sidebar, painted beside its body by `blog-post-content`. */
  postSidebar?: PostSidebar;
};

export async function Modules({
  modules,
  context,
}: {
  modules: AnyModule[];
  context: ModuleContext;
}) {
  if (!modules.length) return null;
  return (
    <>
      {modules.flatMap((m) => {
        if (m.hidden) return [];
        // The post's own cards mean nothing on another page.
        if (!context.post && POST_ONLY.has(m._type)) return [];
        const block = <ModuleSwitch module={m} context={context} />;
        if (context.sidebar) {
          return [
            <SidebarCard
              key={m._key}
              type={m._type}
              // The phone shows the TOC above the article (`MobileToc`), not after it.
              className={
                m._type === "module.blog-toc" ? "max-lg:hidden" : undefined
              }
            >
              {block}
            </SidebarCard>,
          ];
        }
        // The blog's post-list primitives take no anchor; give their block one here.
        return [
          m.anchor && UNANCHORED.has(m._type) ? (
            <div key={m._key} id={m.anchor}>
              {block}
            </div>
          ) : (
            <Fragment key={m._key}>{block}</Fragment>
          ),
        ];
      })}
    </>
  );
}

/** Blocks that describe the post being read. */
const POST_ONLY = new Set<string>([
  "module.blog-toc",
  "module.blog-related",
  "module.blog-post-content",
]);

/** Blog blocks whose renderer paints no `id` of its own. */
const UNANCHORED = new Set<string>([
  "module.blog-hero",
  "module.blog-explore",
  "module.blog-category-spotlight",
  "module.blog-collection",
  "module.blog-topic-cards",
  "module.blog-trending",
]);

async function ModuleSwitch({
  module: m,
  context,
}: {
  module: AnyModule;
  context: ModuleContext;
}) {
  const { locale, post, sidebar: compact } = context;
  switch (m._type) {
    case "module.blog-post-list":
      return <BlogPostList module={m} locale={locale} compact={compact} />;
    case "module.blog-hero":
      return <BlogHeroModule module={m} locale={locale} />;
    case "module.blog-featured":
      return <BlogFeatured module={m} locale={locale} compact={compact} />;
    case "module.blog-explore":
      return <BlogExplore module={m} locale={locale} />;
    case "module.blog-category-spotlight":
      return <BlogCategorySpotlight module={m} locale={locale} />;
    case "module.blog-collection":
      return <BlogCollection module={m} locale={locale} compact={compact} />;
    case "module.blog-topic-cards":
      return <BlogTopicCards module={m} locale={locale} />;
    case "module.blog-trending":
      return <BlogTrending module={m} locale={locale} compact={compact} />;
    case "module.blog-toc":
      return <BlogToc module={m} post={post} locale={locale} />;
    case "module.blog-related":
      return <BlogRelated module={m} post={post} locale={locale} />;
    case "module.blog-post-content":
      return post ? (
        <BlogPostContent
          module={m}
          post={post}
          locale={locale}
          sidebar={context.postSidebar}
        />
      ) : null;
    case "module.blog-index":
      return <BlogIndex {...m} />;
    default:
      // In a sidebar card a generic block renders bare (`inline`): the card owns the frame.
      return renderBlock(
        (compact ? { ...m, inline: true } : m) as BlockModule,
        portableComponents,
      );
  }
}
