/**
 * Define the Sanity document schema for a blog category.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/category.md
 */
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Catégorie",
  type: "document",
  fields: [
    defineField({
      // Géré par @sanity/document-internationalization : masqué + lecture
      // seule (le plugin écrit la valeur à la création).
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
      // `exclude` : une traduction démarre avec un slug vide, pas une copie
      // du slug source — chaque locale a sa propre URL.
      options: {
        source: "title",
        maxLength: 96,
        documentInternationalization: { exclude: true },
      },
      description: "Fragment d'URL pour /blog/category/<slug>.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "parent",
      title: "Catégorie parente",
      type: "reference",
      to: [{ type: "category" }],
      description:
        "Vide = catégorie principale (apparaît directement dans la barre du blog). Choisissez une parente pour en faire une sous-catégorie, listée dans le menu déroulant de la parente.",
      options: {
        // Même langue uniquement, et jamais elle-même (pas d'auto-référence).
        filter: ({ document }) => ({
          filter: "language == $lang && !(_id in [$self, $draftSelf])",
          params: {
            lang: document?.language ?? "en",
            self: (document?._id ?? "").replace(/^drafts\./, ""),
            draftSelf: `drafts.${(document?._id ?? "").replace(/^drafts\./, "")}`,
          },
        }),
      },
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
