import type { PortableTextComponents } from "@portabletext/react";
import type { BlockModule } from "@indiecrafts/ui-components/types";
import { AccordionList } from "./AccordionList";
import { Callout } from "./Callout";
import { CardList } from "./CardList";
import { CustomHtml } from "./CustomHtml";
import { Gallery } from "./Gallery";
import { PersonList } from "./PersonList";
import { Prose } from "./Prose";
import { QuoteList } from "./QuoteList";
import { StatList } from "./StatList";
import { StepList } from "./StepList";

/**
 * Block registry — the single `_type` → component map for the generic
 * page-builder blocks. Two consumers derive from it:
 *
 *   - `portable-text-components` `types` map (inline blocks in a rich-text body)
 *   - any page-type dispatcher (the blog's `ModuleRenderer`, an app page builder)
 *     that spreads `BLOCK_RENDERERS` and adds its own page-specific modules.
 *
 * The `satisfies` clause forces exhaustiveness — leaving out a `BlockModule`
 * `_type`, or letting one drift, is a compile error.
 */
type BlockOf<T extends BlockModule["_type"]> = Extract<BlockModule, { _type: T }>;

/**
 * Blocks that render nested PortableText (Callout, Prose, …) receive the
 * component map via `components` rather than importing it — that import would
 * close a cycle (renderer → portable-text-components → registry → renderer).
 */
type BlockRenderer<T extends BlockModule["_type"]> = (
  props: BlockOf<T> & { inline?: boolean; components: PortableTextComponents },
) => React.ReactNode;

export const BLOCK_RENDERERS = {
  "module.accordion-list": AccordionList,
  "module.callout": Callout,
  "module.card-list": CardList,
  "module.gallery": Gallery,
  "module.person-list": PersonList,
  "module.prose": Prose,
  "module.stat-list": StatList,
  "module.step-list": StepList,
  "module.quote-list": QuoteList,
  "module.custom-html": CustomHtml,
} satisfies { [K in BlockModule["_type"]]: BlockRenderer<K> };

/** Render one block by `_type`; `components` is the map for its nested content. */
export function renderBlock<M extends BlockModule>(
  module: M,
  components: PortableTextComponents,
): React.ReactNode {
  const Component = BLOCK_RENDERERS[module._type] as BlockRenderer<typeof module._type>;
  return Component({ ...(module as BlockOf<typeof module._type>), components });
}
