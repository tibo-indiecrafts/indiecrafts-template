import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";
import { MODULE_TYPES } from "../modules";

const moduleFieldRefs = MODULE_TYPES.map((type) => ({ type }));

/**
 * Blog singleton — owns the per-post layout shell only.
 *
 * The `/blog` frontpage is intentionally NOT editor-configurable; it
 * always renders the default layout (hero card grid + ExploreCategories
 * + ExploreTags + TopAuthors). Customize via code if you need a
 * different landing.
 *
 * `postModules` composes the chrome around EVERY `/blog/[slug]` — drop
 * a `Fil d'ariane`, then `Contenu de l'article (article actif)`, then
 * `Liste d'articles` for related posts. When the array is empty, the
 * route falls back to `DefaultPostLayout`.
 *
 * Editors only ever have ONE of these. Studio singleton wiring lives in
 * `src/sanity/structure.ts`.
 */
export default defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  icon: BlockContentIcon,
  // Block "+ Create" + global search/list surfaces — the singleton has
  // exactly one instance with `documentId: "blog"`, edited from the
  // sidebar entry in `structure.ts`. Without this an editor could
  // accidentally produce a second doc via search → 404 in `[0]` GROQ.
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "postModules",
      title: "Modules par article",
      description:
        "Compose la mise en page de chaque /blog/[slug]. Vide = mise en page article par défaut. Incluez un module « Contenu de l'article (article actif) » pour afficher le corps de l'article.",
      type: "array",
      of: moduleFieldRefs,
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
    defineField({
      name: "comments",
      title: "Commentaires — textes",
      description:
        "Les textes de la section commentaires sous chaque article, modifiables par langue. Vide = pas affiché tant qu'un texte n'est pas renseigné.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      // Each field is a `localeString` → one input per language (English /
      // Français), so an editor changes the wording without a code deploy.
      fields: [
        defineField({ name: "heading", title: "Titre de la section", type: "localeString" }),
        defineField({ name: "nameLabel", title: "Libellé « Nom »", type: "localeString" }),
        defineField({ name: "emailLabel", title: "Libellé « E-mail »", type: "localeString" }),
        defineField({ name: "bodyLabel", title: "Libellé « Commentaire »", type: "localeString" }),
        defineField({ name: "consentLabel", title: "Texte de consentement", type: "localeString" }),
        defineField({ name: "submitLabel", title: "Bouton d'envoi", type: "localeString" }),
        defineField({ name: "replyLabel", title: "Bouton « Répondre »", type: "localeString" }),
        defineField({ name: "cancelLabel", title: "Bouton « Annuler »", type: "localeString" }),
        defineField({ name: "successMessage", title: "Message après envoi", type: "localeString" }),
        defineField({ name: "emptyMessage", title: "Aucun commentaire", type: "localeString" }),
        defineField({ name: "errorMessage", title: "Message d'erreur", type: "localeString" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Blog",
      subtitle: "Mise en page par article",
    }),
  },
});
