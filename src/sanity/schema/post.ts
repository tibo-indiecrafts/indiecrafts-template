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
  title: "Article",
  type: "document",
  icon: EditIcon,
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "metadata", title: "Métadonnées" },
  ],
  fields: [
    defineField({
      name: "language",
      title: "Langue",
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
      description:
        "Détermine la locale dans laquelle l'article apparaît (/en/blog ou /fr/blog).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publié le",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
    }),
    defineField({
      name: "categories",
      title: "Catégories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
          // Studio reference selector — only show categories in the same
          // language as the post being edited. Without this, the picker
          // lists EN + FR categories side-by-side and editors silently
          // attach the wrong locale.
          options: {
            filter: ({ document }) =>
              document.language
                ? {
                    filter: "language == $lang",
                    params: { lang: document.language as string },
                  }
                : { filter: "" },
          },
        },
      ],
      group: "content",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "tag" }],
          options: {
            filter: ({ document }) =>
              document.language
                ? {
                    filter: "language == $lang",
                    params: { lang: document.language as string },
                  }
                : { filter: "" },
          },
        },
      ],
      description: "Étiquettes plus fines. Chaque tag a sa propre page /blog/tag/<slug>.",
      group: "content",
    }),
    defineField({
      name: "featured",
      title: "Mis en avant",
      type: "boolean",
      description: "Marqué comme article phare (utilisé par `featuredPostsQuery`).",
      initialValue: false,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Corps",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "modules",
      title: "Modules (remplacent la mise en page)",
      description:
        "Optionnel. Lorsqu'ils sont renseignés, ces modules composent la mise en page de l'article au lieu des `blog.postModules` partagés. Insérez un `module.blog-post-content` quelque part dans le tableau pour placer le champ corps ci-dessus. Pratique pour les articles vitrines ponctuels.",
      type: "array",
      of: MODULE_FIELD_REFS,
      group: "content",
    }),
    defineField({
      name: "metadata",
      title: "Métadonnées",
      type: "metadata",
      group: "metadata",
      // La feuille réellement requise est `metadata.slug` (définie dans
      // le schéma `metadata`). Marquer le wrapper comme requis affiche
      // un toast confus « Métadonnées requises » alors qu'il s'agit du
      // slug.
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
      title: "Publication (récents)",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      name: "titleAsc",
      title: "Titre A→Z",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
