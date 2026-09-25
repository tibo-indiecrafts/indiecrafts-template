/**
 * Define the blog-index hero page-builder module schema.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/modules/blog-index.md
 */
import { HomeIcon } from "@sanity/icons/Home";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-index",
  title: "Hero du blog",
  icon: HomeIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: "Hero du blog",
      subtitle: title,
    }),
  },
});
