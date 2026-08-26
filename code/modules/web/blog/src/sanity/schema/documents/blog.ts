import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";
import { MODULE_TYPES } from "@indiecrafts/packages-web-page-builder/sanity/schema/modules";
import { BLOG_MODULE_TYPES } from "../modules";

// The per-post layout can compose the generic blocks + the 3 blog-specific ones.
const moduleFieldRefs = [...MODULE_TYPES, ...BLOG_MODULE_TYPES].map((type) => ({
  type,
}));

/**
 * A display toggle — a boolean that defaults to ON, so an editor never
 * has to opt into showing something that was always visible. The legend
 * spells out what turning it off hides, then reminds that empty = shown.
 */
const toggle = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "boolean",
    initialValue: true,
    description: description
      ? `${description} Vide = affiché.`
      : "Vide = affiché.",
  });

/**
 * Blog singleton — owns the per-post layout shell + the frontpage.
 *
 * `frontpageModules` composes the `/blog` frontpage — drop a hero, a post
 * list, an explore block, etc. When the array is empty, the route falls
 * back to the default layout (hero card grid + ExploreCategories +
 * ExploreTags + TopAuthors).
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
    defineField({
      name: "frontpageModules",
      title: "Sections de l'accueil du blog",
      description:
        "Compose la page /blog en empilant des sections (grande une, à la une, articles, pleins feux, carrousel, sujets, explorer, newsletter…). Vide = mise en page par défaut.",
      type: "array",
      of: moduleFieldRefs,
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
    defineField({
      name: "indexSeo",
      title: "SEO des pages de listing",
      type: "object",
      description:
        "SEO des pages qui listent les auteur·rice·s, catégories et tags (/author, /blog/category, /blog/tag). Vide = titre + description par défaut.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "author",
          title: "Page « Auteur·rice·s »",
          type: "seoMeta",
        }),
        defineField({
          name: "category",
          title: "Page « Catégories »",
          type: "seoMeta",
        }),
        defineField({ name: "tag", title: "Page « Tags »", type: "seoMeta" }),
      ],
    }),
    defineField({
      name: "display",
      title: "Affichage du blog",
      description:
        "Activez ou masquez des éléments du blog — sans passer par un développeur.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "taxonomy",
          title: "Catégories, tags, auteur·rice·s",
          type: "object",
          options: { collapsible: true },
          description:
            "Désactiver masque les puces ET la page de listing (retirée du plan de site et des liens).",
          fields: [
            toggle(
              "categories",
              "Catégories",
              "Puces de catégorie + page /blog/category.",
            ),
            toggle("tags", "Tags", "Puces de tag + page /blog/tag."),
            toggle(
              "authors",
              "Auteur·rice·s",
              "Signature d'auteur·rice + page /author.",
            ),
            toggle(
              "categoryNav",
              "Barre de navigation par catégorie",
              "Barre horizontale des catégories en haut des pages du blog, avec un menu déroulant des sous-catégories.",
            ),
          ],
        }),
        defineField({
          name: "post",
          title: "Page article",
          type: "object",
          options: { collapsible: true },
          fields: [
            toggle("date", "Date de publication"),
            toggle("readingTime", "Temps de lecture"),
            toggle("tableOfContents", "Sommaire (table des matières)"),
            toggle("relatedPosts", "« À lire ensuite » (articles liés)"),
            toggle(
              "readingProgress",
              "Barre de progression de lecture",
              "Fine barre en haut de l'écran qui avance pendant la lecture.",
            ),
          ],
        }),
        defineField({
          name: "frontpage",
          title: "Accueil du blog (/blog)",
          type: "object",
          options: { collapsible: true },
          fields: [
            toggle(
              "featuredHero",
              "Grille « à la une »",
              "Mosaïque des articles en avant. Désactivé = grille simple.",
            ),
          ],
        }),
        defineField({
          name: "cards",
          title: "Cartes d'article",
          type: "object",
          options: { collapsible: true },
          fields: [
            toggle(
              "excerpt",
              "Extrait",
              "Résumé sous le titre dans les listes.",
            ),
          ],
        }),
      ],
    }),
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
        defineField({
          name: "heading",
          title: "Titre de la section",
          type: "localeString",
        }),
        defineField({
          name: "nameLabel",
          title: "Libellé « Nom »",
          type: "localeString",
        }),
        defineField({
          name: "emailLabel",
          title: "Libellé « E-mail »",
          type: "localeString",
        }),
        defineField({
          name: "bodyLabel",
          title: "Libellé « Commentaire »",
          type: "localeString",
        }),
        defineField({
          name: "consentLabel",
          title: "Texte de consentement",
          type: "localeString",
        }),
        defineField({
          name: "submitLabel",
          title: "Bouton d'envoi",
          type: "localeString",
        }),
        defineField({
          name: "replyLabel",
          title: "Bouton « Répondre »",
          type: "localeString",
        }),
        defineField({
          name: "cancelLabel",
          title: "Bouton « Annuler »",
          type: "localeString",
        }),
        defineField({
          name: "successMessage",
          title: "Message après envoi",
          type: "localeString",
        }),
        defineField({
          name: "emptyMessage",
          title: "Aucun commentaire",
          type: "localeString",
        }),
        defineField({
          name: "errorMessage",
          title: "Message d'erreur",
          type: "localeString",
        }),
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
