import { defineField, defineType } from "sanity";

/**
 * Lien polymorphe utilisé dans les modules — pointe vers un article
 * interne ou une URL externe. Les renderers normalisent le `href`
 * résolu via le LINK_FRAGMENT dans `src/sanity/queries.ts`.
 *
 * Portée du blog : la cible interne est uniquement un document `post`.
 * Utilisez le champ URL externe pour les pages marketing / autres sites.
 */
export default defineType({
  name: "link",
  title: "Lien",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Article interne", value: "internal" },
          { title: "URL externe", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "label",
      title: "Libellé",
      type: "string",
    }),
    defineField({
      name: "internal",
      title: "Article interne",
      type: "reference",
      to: [{ type: "post" }],
      hidden: ({ parent }) => parent?.type !== "internal",
    }),
    defineField({
      name: "external",
      title: "URL externe",
      type: "url",
      hidden: ({ parent }) => parent?.type !== "external",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
    defineField({
      name: "newTab",
      title: "Ouvrir dans un nouvel onglet",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
