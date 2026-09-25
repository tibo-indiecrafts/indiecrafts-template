/**
 * Bundles the page document, blocks, entities, desk, and templates as a SanityModule.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/index.md
 */
import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import { locales } from "@indiecrafts/packages-shared-config";
import { schemaTypes } from "./schema";
import { pageBuilderStructure } from "./structure";

/**
 * The page-builder's Sanity contribution — the `page` document + the 16 generic
 * blocks + the `quote`/`person` entities + `blockContent`/`link`/`cta` objects, its
 * desk sections (Pages · Témoignages · Équipe), and per-(type, locale) create
 * templates. Drop `pageBuilderSanity` into `composeStudio([...])` in
 * `sanity.config.ts`. Feature-independent — every site has pages, so it is not gated.
 */
const I18N_TYPES = ["page", "quote", "person"] as const;

const TEMPLATE_TITLES: Record<(typeof I18N_TYPES)[number], string> = {
  page: "Page",
  quote: "Témoignage",
  person: "Membre d'équipe",
};

export const pageBuilderSanity: SanityModule = {
  name: "page-builder",
  schemaTypes,
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
