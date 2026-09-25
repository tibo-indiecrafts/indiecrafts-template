/**
 * Bundles the localeSuggest singleton and desk section as a SanityModule.
 *
 * @see docs/reference/packages/web/locale-suggest/src/sanity/index.md
 */
import type { SchemaTypeDefinition } from "sanity";
import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import localeSuggest from "./locale-suggest";
import { localeSuggestStructureItem } from "./structure";

/**
 * The locale-suggest brick's Sanity contribution — the `localeSuggest` copy
 * singleton + its desk section. Add to the `sharedModules` array in
 * `sanity.config.ts` to activate.
 */
export const localeSuggestSanity: SanityModule = {
  name: "localeSuggest",
  schemaTypes: [localeSuggest] as SchemaTypeDefinition[],
  structure: (S) => [localeSuggestStructureItem(S)],
};
