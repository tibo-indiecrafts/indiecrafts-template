import { defineField, defineType } from "sanity";

/**
 * A person — used by the Person List module (team / contributors).
 * Distinct from `author` which is specifically the author of a post.
 */
export default defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
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
      title: "Social links",
      type: "array",
      of: [{ type: "link" }],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
