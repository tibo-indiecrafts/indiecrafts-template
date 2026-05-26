import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.blog-post-list",
  title: "Blog post list",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "limit",
      title: "Limit",
      type: "number",
      description: "Max posts to show. Leave blank for all.",
      validation: (Rule) => Rule.min(1).max(100),
    }),
    defineField({
      name: "categories",
      title: "Filter by categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description: "Only show posts in one of these categories. Empty = all.",
    }),
    defineField({
      name: "featuredOnly",
      title: "Featured only",
      type: "boolean",
      description: "Restrict to posts flagged `featured` on the post itself.",
      initialValue: false,
    }),
  ],
});
