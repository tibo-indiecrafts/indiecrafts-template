import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Tag — étiquette légère et localisée pour les articles. Comparable au
 * document `category` mais conçu pour des thèmes plus précis, présents
 * en plusieurs exemplaires sur un même article (un article a une seule
 * catégorie mais peut porter plusieurs tags). Chaque tag possède sa
 * propre page `/blog/tag/<slug>`.
 */
export default defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "language",
      title: "Langue",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Français", value: "fr" },
        ],
        layout: "radio",
      },
      initialValue: "en",
      validation: (Rule) => Rule.required(),
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
      options: { source: "title", maxLength: 96 },
      description: "Fragment d'URL pour /blog/tag/<slug>.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare: ({ title, language }) => ({
      title,
      subtitle: language?.toUpperCase(),
    }),
  },
});
