/**
 * Defines the `tag` Sanity document type — a localized, multi-per-post blog tag.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/tag.md
 */
import { TagIcon } from "@sanity/icons/Tag";
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
      title: "Adresse web",
      type: "slug",
      description:
        "La fin de l'adresse de la page du tag (ex. vegetarien). Minuscules et tirets. « Générer » la crée depuis le titre.",
      // `exclude` : une traduction démarre avec un slug vide, pas une copie
      // du slug source — chaque locale a sa propre URL.
      options: {
        source: "title",
        maxLength: 96,
        documentInternationalization: { exclude: true },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
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
