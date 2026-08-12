import { EditIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Blog post — title + body + structured metadata block.
 *
 * Slug + excerpt + social image all live under `metadata.*` (reusable
 * `metadata` object) so per-post SEO overrides happen in one place. The
 * Studio splits content vs. metadata into two tabs via `groups`.
 *
 * Layout — articles use the shared blog layout (`blog.postModules` when
 * set, otherwise `DefaultPostLayout`). There is intentionally NO
 * per-post layout override on this document; editors compose content,
 * not chrome. Rich inline content inside `body` (callouts, card lists,
 * stat lists, etc.) is available via the "+" insert menu in the
 * PortableText editor.
 */
export default defineType({
  name: "post",
  title: "Article",
  type: "document",
  icon: EditIcon,
  groups: [
    // No group marked `default: true`, so Sanity's built-in "All fields" tab is
    // the active one on open — the whole document shows at once. "Contenu" /
    // "Métadonnées" remain as filter tabs.
    { name: "content", title: "Contenu" },
    { name: "metadata", title: "Métadonnées" },
  ],
  fields: [
    defineField({
      // Géré par @sanity/document-internationalization : masqué + lecture
      // seule pour que l'éditeur ne désynchronise pas un document de son
      // lien `translation.metadata`. Le plugin écrit la valeur à la création.
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
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extrait",
      type: "text",
      rows: 2,
      group: "content",
      description:
        "Accroche affichée sur les cartes et la page de l'article. Retombe sur la description SEO (Métadonnées) si vide.",
    }),
    defineField({
      name: "publishedAt",
      title: "Publié le",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "authors",
      title: "Auteur·rice·s",
      type: "array",
      description:
        "Un article peut avoir plusieurs auteur·rice·s. Le premier de la liste est mis en avant sur les cartes ; l'article apparaît sur la page de chaque auteur·rice. Faites glisser pour réordonner.",
      of: [
        {
          type: "reference",
          to: [{ type: "author" }],
          // Same-language authors only — an EN post links EN author docs.
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
      validation: (Rule) => Rule.min(1).unique(),
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
