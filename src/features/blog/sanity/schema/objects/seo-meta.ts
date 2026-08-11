import { defineField, defineType } from "sanity";

/**
 * Slug-less SEO + visibility override for documents that already own their
 * own `slug` (category, tag, author, blog singleton). Same visibility toggles
 * as the post `metadata` object, without a second slug field.
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
      description: "Jusqu'à ~60 caractères. Retombe sur le titre du document si vide.",
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
      name: "image",
      title: "Image sociale",
      type: "image",
      description: "1200×630 recommandé. Carte OG/Twitter.",
      options: { hotspot: true, metadata: ["lqip"] },
      fields: [defineField({ name: "alt", type: "string", title: "Texte alternatif" })],
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
