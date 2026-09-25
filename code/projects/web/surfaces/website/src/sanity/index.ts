/**
 * Assemble the core, feature-independent Sanity module for the Studio.
 *
 * @see docs/reference/projects/web/website/src/sanity/index.md
 */

import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import {
  seoStructureItem,
  navStructureItem,
  uiMessagesStructureItem,
} from "@indiecrafts/packages-web-sanity/structure";
import { coreSchemaTypes } from "./schema";

/**
 * The app's feature-independent Sanity contribution — the site-wide **shared**
 * surfaces (SEO, navigation, UI messages) that survive with every module removed
 * and are read by every app/lens. Goes in the **"Contenu partagé"** Studio group.
 *
 * The home page is no longer a singleton — it's a `page` (`isHome`) owned by
 * `@indiecrafts/packages-web-page-builder` (desk: "Accueil"). Legal pages (`legalPage`) moved to
 * `@indiecrafts/packages-web-compliance`, also under "Contenu partagé".
 */
export const coreSanity: SanityModule = {
  name: "core",
  schemaTypes: coreSchemaTypes,
  structure: (S) => [
    uiMessagesStructureItem(S),
    seoStructureItem(S),
    navStructureItem(S),
  ],
};
