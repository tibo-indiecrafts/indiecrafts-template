/**
 * Bundles the page document, blocks, sidebar, entities, desk, and templates as a SanityModule.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/index.md
 */
import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import { locales } from "@indiecrafts/packages-shared-config";
import { schemaTypes } from "./schema";
import { definePage } from "./schema/page";
import {
  GENERIC_SIDEBAR_TYPES,
  sidebarSchemas,
  type SidebarPageType,
} from "./schema/objects/sidebar";
import { pageBuilderStructure } from "./structure";

const I18N_TYPES = ["page", "quote", "person"] as const;

const TEMPLATE_TITLES: Record<(typeof I18N_TYPES)[number], string> = {
  page: "Page",
  quote: "Témoignage",
  person: "Membre d'équipe",
};

/**
 * The page-builder's Sanity contribution — the `page` document + the 17 generic blocks +
 * the sidebar (`sidebar`, `sidebarBlocks`, the per-locale `sidebarSettings`) + the
 * `quote`/`person` entities + `blockContent`/`link`/`cta`, its desk sections (Accueil ·
 * Pages · Barre latérale · Témoignages · Équipe), and per-(type, locale) create templates.
 * Feature-independent — every site has pages, so it is not gated.
 *
 * The app adds its own blocks: `sectionTypes` to `page.sections[]`, `sidebarTypes` to the
 * sidebar cards (both on top of the generic ones), and lists its `sidebarPages` (the page
 * types the settings configure, e.g. `post`).
 */
export function pageBuilderSanity({
  sectionTypes = [],
  sidebarTypes = [],
  sidebarPages,
}: {
  sectionTypes?: readonly string[];
  sidebarTypes?: readonly string[];
  sidebarPages: readonly SidebarPageType[];
}): SanityModule {
  return {
    name: "page-builder",
    schemaTypes: [
      definePage({ sectionTypes }),
      ...sidebarSchemas(
        [...GENERIC_SIDEBAR_TYPES, ...sidebarTypes],
        sidebarPages,
      ),
      ...schemaTypes,
    ],
    structure: pageBuilderStructure,
    i18nSchemaTypes: [...I18N_TYPES],
    templates: I18N_TYPES.flatMap((type) =>
      locales.map(({ code: lang }) => ({
        id: `${type}-${lang}`,
        title: `${TEMPLATE_TITLES[type]} (${lang.toUpperCase()})`,
        schemaType: type,
        value: { language: lang },
      })),
    ),
  };
}
