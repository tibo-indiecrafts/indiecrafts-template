import type { Locale } from "@/config";
import type { AnyModule, Post } from "@/sanity/types";
import { AccordionList } from "./AccordionList";
import { BlogIndex } from "./BlogIndex";
import { BlogPostContent } from "./BlogPostContent";
import { BlogPostList } from "./BlogPostList";
import { Breadcrumbs } from "./Breadcrumbs";
import { Callout } from "./Callout";
import { CardList } from "./CardList";
import { CustomHtml } from "./CustomHtml";
import { PersonList } from "./PersonList";
import { Prose } from "./Prose";
import { QuoteList } from "./QuoteList";
import { SearchModule } from "./SearchModule";
import { StatList } from "./StatList";
import { StepList } from "./StepList";

/**
 * Render context for modules. `post` is set when rendering the per-post
 * layout (so `module.blog-post-content` can read the active post).
 */
type Context = {
  locale: Locale;
  post?: Post;
};

/**
 * Drives the page-builder. Hands each module to its matching component
 * (or `BlogPostList` / `BlogPostContent` which need extra context).
 *
 * Returns `null` for the empty-array case — callers (the routes) fall
 * back to their hard-coded default layout when `modules.length === 0`.
 */
export async function Modules({
  modules,
  context,
}: {
  modules: AnyModule[];
  context: Context;
}) {
  if (!modules.length) return null;
  return (
    <>
      {modules
        .filter((m) => !m.hidden)
        .map((m) => (
          <ModuleSwitch key={m._key} module={m} context={context} />
        ))}
    </>
  );
}

async function ModuleSwitch({
  module: m,
  context,
}: {
  module: AnyModule;
  context: Context;
}) {
  switch (m._type) {
    case "module.accordion-list":
      return <AccordionList {...m} />;
    case "module.callout":
      return <Callout {...m} />;
    case "module.card-list":
      return <CardList {...m} />;
    case "module.person-list":
      return <PersonList {...m} />;
    case "module.prose":
      return <Prose {...m} />;
    case "module.stat-list":
      return <StatList {...m} />;
    case "module.step-list":
      return <StepList {...m} />;
    case "module.quote-list":
      return <QuoteList {...m} />;
    case "module.breadcrumbs":
      return <Breadcrumbs {...m} />;
    case "module.custom-html":
      return <CustomHtml {...m} />;
    case "module.search":
      return <SearchModule {...m} />;
    case "module.blog-index":
      return <BlogIndex {...m} />;
    case "module.blog-post-list":
      return <BlogPostList module={m} locale={context.locale} />;
    case "module.blog-post-content":
      return context.post ? (
        <BlogPostContent module={m} post={context.post} locale={context.locale} />
      ) : null;
    default: {
      // Exhaustiveness check — if you add a module type without
      // wiring it here, TS will flag the missing case.
      const _exhaust: never = m;
      void _exhaust;
      return null;
    }
  }
}
