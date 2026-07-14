import type { AnyModule } from "@/features/blog/sanity/types";
import { BlogPostContent } from "./BlogPostContent";
import { BlogPostList } from "./BlogPostList";
import { type ModuleContext, renderSimpleModule } from "./registry";

/**
 * Drives the page-builder. Hands each module to its matching component
 * (or to `BlogPostList` / `BlogPostContent` which need extra context).
 *
 * Returns `null` for the empty-array case — callers (the routes) fall
 * back to their hard-coded default layout when `modules.length === 0`.
 */
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
        m.hidden ? [] : [<ModuleSwitch key={m._key} module={m} context={context} />],
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
  if (m._type === "module.blog-post-content") {
    return context.post ? (
      <BlogPostContent module={m} post={context.post} locale={context.locale} />
    ) : null;
  }
  return renderSimpleModule(m);
}
