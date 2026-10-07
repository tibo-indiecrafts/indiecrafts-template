/**
 * Build the per-locale SEO override field for a document every locale shares.
 *
 * @see docs/reference/packages/web/schema/src/seo-translations.md
 */
import { defineArrayMember, defineField, type FieldDefinition } from "sanity";
import { defaultLocale, locales } from "@indiecrafts/packages-shared-config";
import seoMeta from "./seo-meta";

/** The locales a shared document can override — every one but the default. */
export const OTHER_LOCALES = locales.filter((l) => l.code !== defaultLocale);

/**
 * The `seoMeta` fields a translation carries: the text only. Visibility
 * (`noIndex`, `unpublished`, …), canonical and images stay on the base, so a
 * translation can never index, hide or re-point a page by itself.
 */
export const TRANSLATED_SEO_FIELDS = [
  "title",
  "description",
  "keywords",
  "llmsSummary",
  "llmsFull",
];
const translatedFields = (seoMeta.fields as FieldDefinition[]).filter((f) =>
  TRANSLATED_SEO_FIELDS.includes(f.name),
);

/**
 * A singleton (`blog`, `contactSettings`, `waitlistSettings`) renders in every
 * locale, so its `seoMeta` fields hold one language. This array holds one entry
 * per other locale, with the text of each named field. The read side
 * (`localizedSeo` in the website's `seo-queries.ts`) merges the locale's entry
 * over the base field by field; an empty field keeps the default-locale text.
 *
 * `fields` defaults to the document's `seo`; `indexSeo` passes its three pages.
 */
export function seoTranslationsField(
  fields: { name: string; title: string }[] = [
    { name: "seo", title: "SEO & visibilité" },
  ],
) {
  return defineField({
    name: "seoTranslations",
    title: "SEO dans les autres langues",
    description:
      "Ce contenu sert toutes les langues. Ajoutez une langue pour lui donner son propre titre et sa propre description sur Google. Champ vide = le texte ci-dessus ; la visibilité et les images restent celles ci-dessus.",
    type: "array",
    hidden: OTHER_LOCALES.length === 0,
    of: [
      defineArrayMember({
        name: "seoTranslation",
        type: "object",
        fields: [
          defineField({
            name: "language",
            title: "Langue",
            type: "string",
            options: {
              list: OTHER_LOCALES.map((l) => ({
                title: l.label,
                value: l.code,
              })),
            },
            validation: (Rule) => Rule.required(),
          }),
          ...fields.map((f) =>
            defineField({
              name: f.name,
              title: f.title,
              type: "object",
              fields: translatedFields,
            }),
          ),
        ],
        preview: { select: { title: "language" } },
      }),
    ],
    validation: (Rule) =>
      Rule.custom((entries?: { language?: string }[]) => {
        const langs = (entries ?? []).map((e) => e.language).filter(Boolean);
        return (
          new Set(langs).size === langs.length || "Une seule entrée par langue."
        );
      }),
  });
}
