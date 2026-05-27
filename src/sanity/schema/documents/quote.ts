import { defineField, defineType } from "sanity";

export default defineType({
  name: "quote",
  title: "Quote",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Français", value: "fr" },
        ],
        layout: "radio",
      },
      initialValue: "en",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "author", title: "Author name", type: "string" }),
    defineField({ name: "role", title: "Author role", type: "string" }),
    defineField({
      name: "image",
      title: "Author photo",
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
        title: title ?? "(no author)",
        subtitle: subtitle
          ? `${language?.toUpperCase() ?? ""} · "${subtitle.slice(0, 50)}…"`.trim()
          : language?.toUpperCase(),
        media,
      };
    },
  },
});
