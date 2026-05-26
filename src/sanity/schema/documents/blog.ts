import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";
import { MODULE_TYPES } from "../modules";

const moduleFieldRefs = MODULE_TYPES.map((type) => ({ type }));

/**
 * Blog singleton — owns the layout of the /blog index AND the per-post
 * page. Two `modules: []` arrays compose them; when empty, the routes
 * fall back to a hard-coded default grid / article layout.
 *
 * Editors only ever have ONE of these. Studio singleton wiring lives in
 * `src/sanity/structure.ts`.
 */
export default defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "frontpageModules",
      title: "Frontpage modules",
      description:
        "Composes the /blog landing. Empty = default card grid. Add a 'Blog post list' module to render posts.",
      type: "array",
      of: moduleFieldRefs,
    }),
    defineField({
      name: "postModules",
      title: "Per-post modules",
      description:
        "Composes the layout of every /blog/[slug] page. Empty = default article layout. Include a 'Blog post content' module to render the active post's body.",
      type: "array",
      of: moduleFieldRefs,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Blog", subtitle: "Frontpage + per-post layout" }),
  },
});
