import { defineField, defineType } from "sanity";

export default defineType({
  name: "quote",
  title: "Quote",
  type: "document",
  fields: [
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
    select: { title: "author", subtitle: "content", media: "image" },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "(no author)",
        subtitle: subtitle ? `"${subtitle.slice(0, 50)}…"` : undefined,
        media,
      };
    },
  },
});
