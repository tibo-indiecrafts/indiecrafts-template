import { defineField, defineType } from "sanity";

/**
 * Une personne — utilisée par le module Person List (équipe / contributeurs).
 * Distinct de `author`, qui correspond précisément à l'auteur d'un article.
 */
export default defineType({
  name: "person",
  title: "Membre d'équipe",
  type: "document",
  fields: [
    defineField({
      // Géré par @sanity/document-internationalization : masqué + lecture
      // seule (le plugin écrit la valeur à la création).
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      initialValue: "en",
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", title: "Rôle", type: "string" }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "social",
      title: "Liens sociaux",
      type: "array",
      of: [{ type: "link" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      role: "role",
      language: "language",
      media: "image",
    },
    prepare: ({ title, role, language, media }) => ({
      title,
      subtitle: [language?.toUpperCase(), role].filter(Boolean).join(" · "),
      media,
    }),
  },
});
