/**
 * Define the quote document — a testimonial shown by the Quote List module.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/documents/quote.md
 */
import { defineField, defineType } from "sanity";

export default defineType({
  name: "quote",
  title: "Témoignage",
  type: "document",
  fields: [
    defineField({
      // Géré par @sanity/document-internationalization : masqué + lecture
      // seule (le plugin écrit la valeur à la création). Auparavant un menu
      // manuel — migré vers le plugin pour être cohérent avec post/category/tag.
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      initialValue: "en",
    }),
    defineField({
      name: "content",
      title: "Contenu",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "author", title: "Nom de l'auteur", type: "string" }),
    defineField({ name: "role", title: "Rôle / fonction", type: "string" }),
    defineField({
      name: "image",
      title: "Photo de l'auteur",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "author",
      subtitle: "content",
      language: "language",
      media: "image",
    },
    prepare({ title, subtitle, language, media }) {
      return {
        title: title ?? "(sans auteur)",
        subtitle: subtitle
          ? `${language?.toUpperCase() ?? ""} · « ${subtitle.slice(0, 50)}… »`.trim()
          : language?.toUpperCase(),
        media,
      };
    },
  },
});
