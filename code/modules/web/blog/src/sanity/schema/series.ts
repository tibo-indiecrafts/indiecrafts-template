import { StackCompactIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Series — an ordered collection of posts (a multi-part guide). A post
 * points at one series via `post.series` + `post.seriesOrder`; the series
 * gets its own `/blog/series/<slug>` landing page. Localized like the other
 * taxonomies (one doc per language).
 */
export default defineType({
  name: "series",
  title: "Série",
  type: "document",
  icon: StackCompactIcon,
  fields: [
    defineField({
      // Géré par @sanity/document-internationalization : masqué + lecture seule.
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      initialValue: "en",
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        documentInternationalization: { exclude: true },
      },
      description: "Fragment d'URL pour /blog/series/<slug>.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Présentation de la série, affichée en haut de sa page.",
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare: ({ title, language }) => ({
      title,
      subtitle: language?.toUpperCase(),
    }),
  },
});
