import { EditIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

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
      media: "metadata.image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : undefined,
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
