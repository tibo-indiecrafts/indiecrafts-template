import { defineField, defineType } from "sanity";

/**
 * Reusable `metadata` object — per-document SEO override.
 *
 * Holds the canonical slug + the title / description / image used for
 * `<head>`, social cards, JSON-LD, and RSS. Designed to be referenced
 * from any document type that has a public URL — currently `post`, but
 * scales to `page`, `author`, etc.
 *
 * Pattern ported from `nuotsu/sanitypress-with-typegen`.
 */
export default defineType({
  name: "metadata",
  title: "Métadonnées",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description: "Jusqu'à ~60 caractères. Retombe sur le titre du document si vide.",
      validation: (Rule) =>
        Rule.max(60).warning(
          "Restez sous 60 caractères pour les résultats de recherche.",
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "Description SEO (résultats de recherche + partages sociaux). ~160 caractères. Le texte affiché sur les cartes vient du champ « Extrait » (onglet Contenu) — il retombe ici s'il est vide.",
      validation: (Rule) =>
        Rule.max(160).warning(
          "Restez sous 160 caractères pour les résultats de recherche.",
        ),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Chemin d'URL. Minuscules, tirets uniquement.",
      options: {
        source: (doc) =>
          (doc as { title?: string; metadata?: { title?: string } }).metadata?.title ??
          (doc as { title?: string }).title ??
          "",
        maxLength: 96,
        // `exclude` : une traduction d'article démarre avec un slug vide,
        // pas une copie du slug source — chaque locale a sa propre URL.
        documentInternationalization: { exclude: true },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image sociale",
      type: "image",
      description:
        "1200×630 recommandé. Utilisée pour les cartes OG/Twitter + les couvertures dans le listing.",
      options: { hotspot: true, metadata: ["lqip"] },
      fields: [defineField({ name: "alt", type: "string", title: "Texte alternatif" })],
    }),
    defineField({
      name: "videoUrl",
      title: "Vidéo à la une",
      type: "url",
      description:
        "URL YouTube, Vimeo, Dailymotion ou fichier (.mp4/.webm). Si renseignée, le héros de l'article lit cette vidéo à la place de l'image — l'image sociale ci-dessus sert alors d'aperçu (poster). Collez l'URL, pas un code d'intégration.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).warning(
          "Utilisez une URL http(s) YouTube, Vimeo, Dailymotion ou de fichier vidéo.",
        ),
    }),
    defineField({
      name: "noIndex",
      title: "Masquer des moteurs de recherche",
      type: "boolean",
      description: "Ajoute robots:noindex + retire l'article du RSS et du plan de site.",
      initialValue: false,
    }),
    defineField({
      name: "hideFromDiscovery",
      title: "Masquer des listings du site",
      type: "boolean",
      description:
        "Retire des listings, de l'explorateur et des articles liés — la page reste accessible par son URL directe.",
      initialValue: false,
    }),
    defineField({
      name: "unpublished",
      title: "Dépublier (page inaccessible)",
      type: "boolean",
      description:
        "La page renvoie 404 partout — retirée des listings, du plan de site, du RSS et de son URL directe. Le document reste éditable dans le Studio.",
      initialValue: false,
    }),
    defineField({
      name: "llmsSummary",
      title: "Résumé pour les IA (llms.txt)",
      type: "text",
      rows: 4,
      description:
        "Texte libre : décrivez l'article pour /llms.txt. Affiché comme une ligne de résumé (sauts de ligne aplatis). Vide = la description SEO. Contenu long = champ « Contenu complet » ci-dessous.",
    }),
    defineField({
      name: "llmsFull",
      title: "Contenu complet pour les IA (llms-full)",
      type: "text",
      rows: 10,
      description:
        "Markdown exposé sur /blog/<slug>/md (la version texte pour les assistants IA). Vide = le corps de l'article est utilisé.",
    }),
  ],
});
