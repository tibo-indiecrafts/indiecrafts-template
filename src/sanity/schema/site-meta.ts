import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

/**
 * One taxonomy-index page's editorial copy (heading + intro + empty states).
 * The ICU/structural strings (post counts, breadcrumb aria) stay in `messages`.
 */
const taxonomyGroup = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "heading", title: "Titre de la page", type: "string" }),
      defineField({
        name: "subheading",
        title: "Sous-titre",
        type: "text",
        rows: 2,
      }),
      defineField({
        name: "empty",
        title: "Message si vide",
        type: "string",
        description: "Affiché quand il n'y a encore rien à lister.",
      }),
    ],
  });

/**
 * Per-locale site SEO — fixed-id singletons (`siteMeta.en` / `siteMeta.fr`, one
 * per locale) that let an editor control ALL per-language SEO from the Studio:
 * the site tagline / description / keywords, the Open Graph share card, the
 * llms.txt summary + resources, and per-page `<title>` / description overrides.
 *
 * SOLE runtime source for this text (no `messages`/`config` fallback) — read by
 * `getSiteSeo` (`src/lib/seo/site-seo.ts`). NOT plugin-translated: one fixed
 * `_id` per locale, edited from the "SEO & métadonnées" desk entry
 * (`src/sanity/structure.ts`).
 */
export default defineType({
  name: "siteMeta",
  title: "SEO par langue",
  type: "document",
  icon: EarthGlobeIcon,
  __experimental_omnisearch_visibility: false,
  groups: [
    { name: "site", title: "Site", default: true },
    { name: "pages", title: "Pages" },
    { name: "taxonomy", title: "Pages de listing" },
    { name: "system", title: "Pages système" },
    { name: "llms", title: "Assistants IA" },
  ],
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),

    // ── Site-wide (this language) ──────────────────────────────
    defineField({
      name: "tagline",
      title: "Slogan",
      type: "string",
      group: "site",
      description:
        "Quelques mots qui résument le site. Ex. « Le design au service des artisans ».",
    }),
    defineField({
      name: "description",
      title: "Description du site",
      type: "text",
      rows: 3,
      group: "site",
      description: "~155 caractères. Description SEO par défaut du site.",
      validation: (Rule) => Rule.max(200).warning("Restez concis (~155 caractères)."),
    }),
    defineField({
      name: "keywords",
      title: "Mots-clés du site",
      type: "string",
      group: "site",
      description: "Séparés par des virgules.",
    }),
    defineField({
      name: "ogImage",
      title: "Image de partage",
      type: "image",
      group: "site",
      options: { hotspot: true },
      description:
        "L'image affichée quand un lien du site est partagé sur les réseaux sociaux. Format 1200×630.",
      fields: [defineField({ name: "alt", title: "Texte alternatif", type: "string" })],
    }),

    // ── Per-page overrides ─────────────────────────────────────
    defineField({
      name: "pageSeo",
      title: "SEO par page",
      type: "array",
      group: "pages",
      of: [{ type: "pageSeo" }],
      description: "Titre / description / mots-clés propres à chaque page.",
    }),

    // ── Taxonomy listing pages (category / tag / author index) ──
    defineField({
      name: "taxonomyPages",
      title: "Pages de listing",
      type: "object",
      group: "taxonomy",
      description:
        "Textes des pages qui listent les catégories, tags et auteurs. Vide = texte par défaut.",
      options: { collapsible: true, collapsed: false },
      fields: [
        taxonomyGroup("category", "Page « Catégories »"),
        taxonomyGroup("tag", "Page « Tags »"),
        taxonomyGroup("author", "Page « Auteurs »"),
      ],
    }),

    // ── System pages (maintenance + 404) ───────────────────────
    defineField({
      name: "systemPages",
      title: "Pages système",
      type: "object",
      group: "system",
      description:
        "Textes des pages techniques du site. Vide = le texte par défaut est utilisé.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "maintenance",
          title: "Page de maintenance",
          type: "object",
          description: "Affichée quand le site est mis en pause.",
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: "status",
              title: "Étiquette de statut",
              type: "string",
              description: "Petit texte en haut. Ex. « En maintenance ».",
            }),
            defineField({ name: "title", title: "Titre", type: "string" }),
            defineField({
              name: "body",
              title: "Message",
              type: "text",
              rows: 3,
              description: "Ce que voit le visiteur pendant la pause.",
            }),
            defineField({
              name: "contact",
              title: "Texte du lien de contact",
              type: "string",
              description:
                "Ex. « Nous contacter ». Le lien e-mail est ajouté automatiquement.",
            }),
          ],
        }),
        defineField({
          name: "notFound",
          title: "Page « introuvable » (erreur 404)",
          type: "object",
          description: "Affichée quand une adresse n'existe pas.",
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: "eyebrow",
              title: "Petit texte au-dessus du titre",
              type: "string",
              description: "Ex. « 404 ».",
            }),
            defineField({ name: "title", title: "Titre", type: "string" }),
            defineField({ name: "description", title: "Message", type: "text", rows: 2 }),
            defineField({
              name: "homeLabel",
              title: "Texte du bouton retour",
              type: "string",
              description: "Ex. « ← Retour à l'accueil ».",
            }),
          ],
        }),
      ],
    }),

    // ── llms.txt ───────────────────────────────────────────────
    defineField({
      name: "llms",
      title: "Résumé pour les assistants IA",
      type: "object",
      group: "llms",
      description:
        "Ce que les assistants IA (ChatGPT, Claude, Perplexity…) liront pour parler de votre site.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "summary",
          title: "Résumé en une ligne",
          type: "string",
          description:
            "Une phrase qu'un assistant peut citer. Ex. « Studio de design à Grenoble ».",
        }),
        defineField({
          name: "paragraph",
          title: "Paragraphe",
          type: "text",
          rows: 3,
          description: "2–3 phrases : qui vous êtes, ce que vous proposez.",
        }),
        defineField({
          name: "full",
          title: "Contenu complet du site (llms-full)",
          type: "text",
          rows: 10,
          description:
            "Texte (Markdown) ajouté en tête de /llms-full.txt, avant les pages. Une présentation complète du site pour les assistants IA. Vide = pas d'introduction.",
        }),
        defineField({
          name: "resources",
          title: "Ressources externes",
          type: "array",
          description: "Liens hors site utiles (docs, aide, dépôt, presse).",
          of: [
            defineField({
              name: "resource",
              type: "object",
              fields: [
                defineField({ name: "name", title: "Nom", type: "string" }),
                defineField({ name: "href", title: "Lien", type: "url" }),
              ],
              preview: { select: { title: "name", subtitle: "href" } },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { language: "language", media: "ogImage" },
    prepare: ({ language, media }) => ({
      title: "SEO par langue",
      subtitle: language ? String(language).toUpperCase() : undefined,
      media,
    }),
  },
});
