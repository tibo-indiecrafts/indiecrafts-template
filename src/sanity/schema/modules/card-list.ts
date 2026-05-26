import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.card-list",
  title: "Card list",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      description: "Cards per row on desktop. Defaults to 3.",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description:
                "Optional lucide-react icon key, e.g. 'zap', 'sparkles'. Renderer falls back to no icon when blank.",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "content", title: "Content", type: "blockContent" }),
            defineField({ name: "image", title: "Image", type: "image" }),
            defineField({ name: "cta", title: "CTA", type: "cta" }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),
  ],
});
