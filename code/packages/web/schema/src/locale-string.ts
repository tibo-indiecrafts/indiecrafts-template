/**
 * Build a per-locale `string` field object from the configured locales.
 *
 * @see docs/reference/packages/web/schema/src/locale-string.md
 */
import { defineField, defineType } from "sanity";
import { locales } from "@indiecrafts/packages-shared-config";

/**
 * Field-level i18n for short strings (menu labels, column titles). One `string`
 * field per registered locale — generated from `@indiecrafts/packages-shared-config` `locales` so the set
 * of languages can never drift from the rest of the app. Add a locale there and
 * this object grows a field automatically.
 *
 * Read path resolves `value[locale] ?? value[defaultLocale]` — an empty locale
 * simply falls back to the default one (see `getNavigation`, `src/lib/navigation.ts`).
 */
export default defineType({
  name: "localeString",
  title: "Texte traduit",
  type: "object",
  options: { columns: locales.length > 1 ? 2 : 1 },
  fields: locales.map((l) =>
    defineField({
      name: l.code,
      title: l.label,
      type: "string",
    }),
  ),
});
