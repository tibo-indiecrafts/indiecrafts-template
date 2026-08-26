import type { AnyModule, Post } from "@indiecrafts/modules-web-blog/sanity/types";
import type { BlockModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { renderBlock } from "@indiecrafts/packages-web-ui-components/web/registry";
import { portableComponents } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";
import { BlogFeatured } from "./BlogFeatured";
import { BlogHeroModule } from "./BlogHeroModule";
import { BlogIndex } from "./BlogIndex";
import { BlogPostContent } from "./BlogPostContent";
import { BlogPostList } from "./BlogPostList";

/**
 * Drives the blog page-builder. The three blog-specific modules (index, post
 * list, post content — they fetch/render live posts) are handled here; every
 * other module is a generic **block** rendered by `@indiecrafts/packages-web-ui-components`
 * via `renderBlock`. Composing the shared registry + these three is the whole
 * dispatcher.
 *
 * Returns `null` for the empty-array case — callers (the routes) fall back to
 * their hard-coded default layout when `modules.length === 0`.
 */
export type ModuleContext = { locale: Locale; post?: Post };

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
      {modules.flatMap((m) =>
        m.hidden
          ? []
          : [<ModuleSwitch key={m._key} module={m} context={context} />],
      )}
    </>
  );
}

async function ModuleSwitch({
  module: m,
  context,
}: {
  module: AnyModule;
  context: ModuleContext;
}) {
  if (m._type === "module.blog-post-list") {
    return <BlogPostList module={m} locale={context.locale} />;
  }
  if (m._type === "module.blog-hero") {
    return <BlogHeroModule module={m} locale={context.locale} />;
  }
  if (m._type === "module.blog-featured") {
    return <BlogFeatured module={m} locale={context.locale} />;
  }
  if (m._type === "module.blog-post-content") {
    return context.post ? (
      <BlogPostContent module={m} post={context.post} locale={context.locale} />
    ) : null;
  }
  if (m._type === "module.blog-index") {
    return <BlogIndex {...m} />;
  }
  return renderBlock(m as BlockModule, portableComponents);
}
