import { EditIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { MODULE_TYPES } from "./modules";

const MODULE_FIELD_REFS = MODULE_TYPES.map((type) => ({ type }));

/**
 * Blog post — title + body + structured metadata block.
 *
 * Slug + excerpt + social image all live under `metadata.*` (reusable
 * `metadata` object) so per-post SEO overrides happen in one place. The
 * Studio splits content vs. metadata into two tabs via `groups`.
 */
export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: EditIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Français", value: "fr" },
        ],
        layout: "radio",
      },
      initialValue: "en",
      description: "Drives which locale this post appears in (/en/blog vs /fr/blog).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      group: "content",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Flagged for editorial highlights (used by `featuredPostsQuery`).",
      initialValue: false,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "modules",
      title: "Modules (overrides post layout)",
      description:
        "Optional. When set, this post's layout is composed of these modules instead of the shared `blog.postModules`. Drop a `module.blog-post-content` somewhere in the array to slot in the body field above. Useful for one-off showcase posts.",
      type: "array",
      of: MODULE_FIELD_REFS,
      group: "content",
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "metadata",
      group: "metadata",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      language: "language",
      media: "metadata.image",
    },
    prepare({ title, subtitle, language, media }) {
      const date = subtitle ? new Date(subtitle).toLocaleDateString() : "";
      return {
        title,
        subtitle: [language?.toUpperCase(), date].filter(Boolean).join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      name: "publishedAtDesc",
      title: "Published (newest)",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      name: "titleAsc",
      title: "Title A→Z",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
