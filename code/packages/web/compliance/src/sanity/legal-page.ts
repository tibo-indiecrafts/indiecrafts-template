import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

/**
 * Legal page — client-editable body for one of the site's legal pages
 * (mentions légales, confidentialité, cookies, CGU, CGV). One doc per
 * (`pageKey`, locale), translated via `@sanity/document-internationalization`.
 *
 * SEO (`<title>` / description / share card / LLMs) lives on `.seo` (the shared
 * `seoMeta`), so each legal page is self-contained like every other doc. `title`
 * below is the on-page H1.
 */
const PAGE_KEYS = [
  { title: "Mentions légales", value: "mentions-legales" },
  { title: "Politique de confidentialité", value: "confidentialite" },
  { title: "Politique de cookies", value: "cookies" },
  { title: "Conditions générales d'utilisation (CGU)", value: "cgu" },
  { title: "Conditions générales de vente (CGV)", value: "cgv" },
];

export default defineType({
  name: "legalPage",
  title: "Page légale",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      initialValue: "en",
    }),
    defineField({
      name: "pageKey",
      title: "Type de page",
      type: "string",
      description:
        "Quelle page légale ce texte remplit. Ne pas changer après création.",
      options: { list: PAGE_KEYS, layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      description: "Le grand titre en haut de la page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Dernière mise à jour",
      type: "date",
      description:
        "Date affichée sous le titre. Mettez-la à jour à chaque modification.",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      description:
        "Le texte légal. Titres, listes, gras et liens sont disponibles.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titre de section", value: "h2" },
            { title: "Sous-titre", value: "h3" },
          ],
          lists: [
            { title: "Puces", value: "bullet" },
            { title: "Numéros", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Lien",
                fields: [
                  defineField({
                    name: "href",
                    title: "Adresse (URL)",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "title", pageKey: "pageKey", language: "language" },
    prepare: ({ title, pageKey, language }) => ({
      title: title ?? pageKey,
      subtitle: [pageKey, language && String(language).toUpperCase()]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
