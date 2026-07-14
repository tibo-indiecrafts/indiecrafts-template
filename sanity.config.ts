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
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";
import { schemaTypes } from "./src/features/blog/sanity/schema";
import { structure } from "./src/features/blog/sanity/structure";

/**
 * Per-(type, locale) initial-value templates. Wired into the sidebar via
 * `S.initialValueTemplateItem(...)` in `structure.ts` so the "+ Create"
 * button on the "Français" leaf of e.g. Posts seeds `language: "fr"`.
 *
 * Without these, every new doc lands with the schema's `initialValue`
 * (always "en"), and editors have to remember to switch the radio.
 */
const LOCALE_TEMPLATE_TITLES: Record<"post" | "category" | "tag" | "quote", string> = {
  post: "Article",
  category: "Catégorie",
  tag: "Tag",
  quote: "Citation",
};

const localeTemplates = (["post", "category", "tag", "quote"] as const).flatMap((type) =>
  (["en", "fr"] as const).map((lang) => ({
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
  schema: { types: schemaTypes, templates: () => localeTemplates },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
