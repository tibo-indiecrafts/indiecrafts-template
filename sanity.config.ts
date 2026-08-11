/**
 * Sanity Studio configuration — embedded Studio at /studio.
 *
 * Schemas live under `src/features/blog/sanity/schema/`; the Studio sidebar
 * layout lives in `src/features/blog/sanity/structure.ts`. Ported from
 * GetNextjsTemplates/blog-forge then enhanced with patterns from
 * nuotsu/sanitypress-with-typegen (metadata object, groups, orderings,
 * sidebar structure).
 */

import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";
import { locales } from "./src/config";
import { schemaTypes } from "./src/features/blog/sanity/schema";
import { structure } from "./src/features/blog/sanity/structure";
import { coreSchemaTypes } from "./src/sanity/schema";

/**
 * Per-(type, locale) initial-value templates. Wired into the sidebar via
 * `S.initialValueTemplateItem(...)` in `structure.ts` so the "+ Create"
 * button on the "Français" leaf of e.g. Posts seeds `language: "fr"`.
 *
 * Without these, every new doc lands with the schema's `initialValue`
 * (always "en"), and editors have to remember to switch the radio.
 */
const LOCALE_TEMPLATE_TITLES: Record<
  "post" | "category" | "tag" | "quote" | "author" | "person",
  string
> = {
  post: "Article",
  category: "Catégorie",
  tag: "Tag",
  quote: "Citation",
  author: "Auteur",
  person: "Personne",
};

const localeTemplates = (
  ["post", "category", "tag", "quote", "author", "person"] as const
).flatMap((type) =>
  locales.map(({ code: lang }) => ({
    id: `${type}-${lang}`,
    title: `${LOCALE_TEMPLATE_TITLES[type]} (${lang.toUpperCase()})`,
    schemaType: type,
    value: { language: lang },
  })),
);

export default defineConfig({
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: {
    types: [...coreSchemaTypes, ...schemaTypes],
    templates: () => localeTemplates,
  },
  plugins: [
    structureTool({ structure }),
    // Links each localized document to its translations (a `translation.metadata`
    // doc per translation set), so the Studio can create/jump between languages
    // and the front-end can resolve a doc's slug in another locale. Every content
    // document is translated — `languageField` reuses the flat `language` field.
    documentInternationalization({
      // Derived from the app's single locale source (`@/config`) so Studio and
      // the front-end can never disagree on which languages exist.
      supportedLanguages: locales.map(({ code, label }) => ({ id: code, title: label })),
      schemaTypes: ["post", "category", "tag", "quote", "author", "person"],
      languageField: "language",
      // Keep the plugin's `translation.metadata` link docs out of global search.
      metadataOmnisearchVisibility: false,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
