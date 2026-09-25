/**
 * Define the per-locale multi-line text Sanity object.
 *
 * @see docs/reference/packages/web/schema/src/locale-text.md
 */
import { defineField, defineType } from "sanity";
import { locales } from "@indiecrafts/packages-shared-config";

/**
 * Field-level i18n for **multi-line** text (email bodies, longer descriptions) —
 * the `localeString` sibling, but `type:"text"` per locale. One field per
 * registered locale, generated from `@indiecrafts/packages-shared-config` `locales` so the set of
 * languages can never drift. Read path resolves `value[locale] ?? value[defaultLocale]`.
 */
export default defineType({
  name: "localeText",
  title: "Texte traduit (multiligne)",
  type: "object",
  options: { columns: locales.length > 1 ? 2 : 1 },
  fields: locales.map((l) =>
    defineField({
      name: l.code,
      title: l.label,
      type: "text",
      rows: 3,
    }),
  ),
});
