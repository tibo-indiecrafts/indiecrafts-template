import type { PortableTextComponents } from "@portabletext/react";
import type { Locale } from "@/config";
import type { AnyModule, Post } from "@/features/blog/sanity/types";
import { AccordionList } from "./AccordionList";
import { BlogIndex } from "./BlogIndex";
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
 * Module registry — the single React-side mapping from `_type` to the
 * component that renders it. Three downstream consumers derive from
 * this map:
 *
 *   - `ModuleRenderer` (`<Modules>` for layout slots like
 *     `blog.postModules[]`)
 *   - `portable-text-components` `types` map (inline modules in a body)
 *   - The TS exhaustiveness check below — every `_type` in `AnyModule`
 *     must have an entry; the mapped type makes a missing key a compile
 *     error.
 *
 * Two modules need extra render context (the active `Post` for
 * `module.blog-post-content`, the locale for `module.blog-post-list`).
 * Those are special-cased in `ModuleRenderer` itself — only their type
 * signatures appear here.
 */

export type ModuleContext = {
  locale: Locale;
  post?: Post;
};

type ModuleOf<T extends AnyModule["_type"]> = Extract<AnyModule, { _type: T }>;

/**
 * Most modules take only their own data, so `(props: M) => ReactNode`.
 * The two context-aware ones declare themselves with a different shape
 * inline in `ModuleRenderer` instead of via this map.
 */
// Modules that render nested PortableText (Callout, Prose, …) receive the
// component map via `components` rather than importing it — that import would
// close a cycle (renderer → portable-text-components → registry → renderer).
type SimpleRenderer<T extends AnyModule["_type"]> = (
  props: ModuleOf<T> & { inline?: boolean; components: PortableTextComponents },
) => React.ReactNode;

type SimpleModuleType = Exclude<
  AnyModule["_type"],
  "module.blog-post-list" | "module.blog-post-content"
>;

/**
 * One entry per simple module. The mapped type forces exhaustiveness:
 * leaving out a type, or letting `_type` drift in the schema, is a
 * compile error.
 */
export const SIMPLE_MODULES = {
  "module.accordion-list": AccordionList,
  "module.callout": Callout,
  "module.card-list": CardList,
  "module.person-list": PersonList,
  "module.prose": Prose,
  "module.stat-list": StatList,
  "module.step-list": StepList,
  "module.quote-list": QuoteList,
  "module.breadcrumbs": Breadcrumbs,
  "module.custom-html": CustomHtml,
  "module.search": SearchModule,
  "module.blog-index": BlogIndex,
} satisfies { [K in SimpleModuleType]: SimpleRenderer<K> };

/**
 * Render a simple module (no extra context required). Returns null for
 * the two context-aware types — `ModuleRenderer` handles those itself.
 */
export function renderSimpleModule<M extends AnyModule>(
  module: M,
  components: PortableTextComponents,
): React.ReactNode {
  if (
    module._type === "module.blog-post-list" ||
    module._type === "module.blog-post-content"
  ) {
    return null;
  }
  const Component = SIMPLE_MODULES[module._type] as SimpleRenderer<typeof module._type>;
  return Component({ ...(module as ModuleOf<typeof module._type>), components });
}
