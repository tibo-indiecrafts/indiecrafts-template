import { defineField, defineType } from "sanity";

/**
 * The ONE per-page SEO + LLMs + visibility model. Carried as `.seo` on every
 * document a route renders — `page` (home + built), `blog` singleton (+ its
 * `indexSeo` for the taxonomy list pages), `post`, `author`, `category`, `tag`,
 * `series`, `legalPage`, `waitlistSettings`. Superset of what used to be three
 * near-duplicate objects (`seoMeta` + post `metadata` + the central `pageSeo`
 * array) — merged so each page is self-contained, one field-set, one editor UI.
 *
 * Structured data references `globalSchema` by type name (registered site-wide
 * in the web app's `coreSchemaTypes`).
 */
export default defineType({
  name: "seoMeta",
  title: "SEO & visibilité",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Titre SEO",
      type: "string",
      description:
        "Jusqu'à ~60 caractères. Retombe sur le titre du document si vide.",
      validation: (Rule) =>
        Rule.max(60).warning(
          "Restez sous 60 caractères pour les résultats de recherche.",
        ),
    }),
    defineField({
      name: "description",
      title: "Description SEO",
      type: "text",
      rows: 3,
      description: "Jusqu'à ~160 caractères.",
      validation: (Rule) =>
        Rule.max(160).warning(
          "Restez sous 160 caractères pour les résultats de recherche.",
        ),
    }),
    defineField({
      name: "keywords",
      title: "Mots-clés",
      type: "string",
      description: "Séparés par des virgules.",
    }),
    defineField({
      name: "image",
      title: "Image de partage",
      type: "image",
      description:
        "1200×630 recommandé. Carte OG/Twitter affichée quand la page est partagée. Vide = image de partage par défaut de la langue.",
      options: { hotspot: true, metadata: ["lqip"] },
      fields: [
        defineField({ name: "alt", type: "string", title: "Texte alternatif" }),
      ],
    }),
    defineField({
      name: "schemaImage",
      title: "Image pour Google (optionnelle)",
      type: "image",
      options: { hotspot: true },
      description:
        "Image que Google peut afficher à côté du résultat. Vide = l'image de partage est utilisée.",
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "canonical",
      title: "Adresse officielle de la page (optionnelle)",
      type: "url",
      description:
        "À remplir seulement si cette page est un doublon d'une autre : indiquez l'adresse de l'originale. Sinon, laissez vide.",
    }),
    defineField({
      name: "noIndex",
      title: "Masquer des moteurs de recherche",
      type: "boolean",
      description: "Ajoute robots:noindex + retire la page du plan de site.",
      initialValue: false,
    }),
    defineField({
      name: "hideFromDiscovery",
      title: "Masquer des listings du site",
      type: "boolean",
      description:
        "Retire des listings et de l'explorateur — la page reste accessible par son URL directe.",
      initialValue: false,
    }),
    defineField({
      name: "unpublished",
      title: "Dépublier (page inaccessible)",
      type: "boolean",
      description:
        "La page renvoie 404 partout — retirée des listings, du plan de site et de son URL directe. Le document reste éditable dans le Studio.",
      initialValue: false,
    }),
    defineField({
      name: "structuredData",
      title: "Informations Google en plus (optionnel)",
      type: "array",
      of: [{ type: "globalSchema" }],
      description:
        "Détails que Google peut mettre en avant pour cette page : un service, un produit, une personne ou un événement.",
    }),
    defineField({
      name: "llmsSection",
      title: "Section pour les IA (llms.txt)",
      type: "string",
      description:
        "Regroupe cette page sous un titre dans /llms.txt. Ex. « Guides », « Références ». Vide = la section « Pages » par défaut. L'ordre des sections se règle dans « SEO par langue » → « Résumé pour les assistants IA » → « Ordre des sections ».",
    }),
    defineField({
      name: "llmsSummary",
      title: "Résumé pour les IA (llms.txt)",
      type: "text",
      rows: 4,
      description:
        "Texte libre : décrivez cette page pour /llms.txt. Affiché comme une ligne de résumé (sauts de ligne aplatis). Vide = la description ci-dessus. Contenu long = « Contenu complet » ci-dessous.",
    }),
    defineField({
      name: "llmsFull",
      title: "Contenu complet pour les IA (llms-full)",
      type: "text",
      rows: 8,
      description:
        "Texte (Markdown) ajouté sous cette page dans /llms-full.txt. Vide = seule la ligne de résumé apparaît.",
    }),
  ],
});
