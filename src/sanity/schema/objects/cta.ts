import { defineField, defineType } from "sanity";

/**
 * Call-to-action — a styled link with a variant. Reused across modules
 * (hero, callout, card-list, etc.).
 */
export default defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "link", title: "Link", type: "link" }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Ghost", value: "ghost" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
});
