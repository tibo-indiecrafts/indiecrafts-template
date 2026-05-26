import { defineField, defineType } from "sanity";

/** Brand logo used by the Logo List module ("trusted by"). */
export default defineType({
  name: "logo",
  title: "Logo",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Brand name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Logo image",
      type: "image",
      options: { hotspot: true },
      description: "SVG preferred. Keep a transparent background.",
    }),
    defineField({
      name: "url",
      title: "Link URL",
      type: "url",
      description: "Optional — link the logo to the brand's site.",
    }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
