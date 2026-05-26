import { defineField, defineType } from "sanity";

/**
 * Reusable `metadata` object — per-document SEO override.
 *
 * Holds the canonical slug + the title / description / image used for
 * `<head>`, social cards, JSON-LD, and RSS. Designed to be referenced
 * from any document type that has a public URL — currently `post`, but
 * scales to `page`, `author`, etc.
 *
 * Pattern ported from `nuotsu/sanitypress-with-typegen`.
 */
export default defineType({
  name: "metadata",
  title: "Metadata",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Up to ~60 chars. Falls back to the document title if blank.",
      validation: (Rule) => Rule.max(60).warning("Keep under 60 characters for SERP."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Up to ~160 chars — also shown on listing cards.",
      validation: (Rule) => Rule.max(160).warning("Keep under 160 characters for SERP."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL path. Use lowercase, dashes only.",
      options: {
        source: (doc) =>
          (doc as { title?: string; metadata?: { title?: string } }).metadata?.title ??
          (doc as { title?: string }).title ??
          "",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Social image",
      type: "image",
      description: "1200×630 recommended. Used for OG/Twitter cards + listing covers.",
      options: { hotspot: true, metadata: ["lqip"] },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Adds robots:noindex + drops the post from RSS + sitemap.",
      initialValue: false,
    }),
  ],
});
