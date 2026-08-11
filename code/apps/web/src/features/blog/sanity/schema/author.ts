import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Auteur",
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
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "position", title: "Poste", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      // `exclude` : une traduction démarre avec un slug vide, pas une copie
      // du slug source — chaque locale a sa propre URL.
      options: {
        source: "name",
        maxLength: 96,
        documentInternationalization: { exclude: true },
      },
      description: "Fragment d'URL pour /author/<slug>.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Biographie",
      type: "array",
      of: [
        {
          title: "Bloc",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "name", language: "language", media: "image" },
    prepare: ({ title, language, media }) => ({
      title,
      subtitle: language?.toUpperCase(),
      media,
    }),
  },
});
