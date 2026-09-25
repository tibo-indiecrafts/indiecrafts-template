/**
 * Assemble the blog's Sanity module barrel for the app.
 *
 * @see docs/reference/modules/web/blog/src/sanity/index.md
 */
import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import { locales } from "@indiecrafts/packages-shared-config";
import { schemaTypes } from "./schema";
import { blogStructure } from "./structure";
import { emailGroups } from "./email";

/**
 * The blog's Sanity contribution — one barrel the app drops into
 * `composeSanity([...])`. Owns its schema, its desk section, its per-(type,
 * locale) create templates, and the list of its document-internationalized
 * types. Adding/removing the blog is one line in `sanity.config.ts`.
 */
const I18N_TYPES = ["post", "category", "tag", "series", "author"] as const;

const TEMPLATE_TITLES: Record<(typeof I18N_TYPES)[number], string> = {
  post: "Article",
  category: "Catégorie",
  tag: "Tag",
  series: "Série",
  author: "Auteur",
};

export const blogSanity: SanityModule = {
  name: "blog",
  schemaTypes,
  structure: blogStructure,
  emailGroups,
  i18nSchemaTypes: [...I18N_TYPES],
  // Per-(type, locale) initial-value templates so "+ Create" on the "Français"
  // leaf seeds `language: "fr"` (see `blogStructure` → `initialValueTemplateItem`).
  templates: I18N_TYPES.flatMap((type) =>
    locales.map(({ code: lang }) => ({
      id: `${type}-${lang}`,
      title: `${TEMPLATE_TITLES[type]} (${lang.toUpperCase()})`,
      schemaType: type,
      value: { language: lang },
    })),
  ),
};
