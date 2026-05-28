import { defineField, defineType } from "sanity";

export default defineType({
  name: "quote",
  title: "Citation",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Langue",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Français", value: "fr" },
        ],
        layout: "radio",
      },
      initialValue: "en",
      validation: (Rule) => Rule.required(),
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
