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
        "Jusqu'à ~160 caractères — également affichée sur les cartes du listing.",
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
        "URL YouTube, Vimeo ou fichier (.mp4/.webm). Si renseignée, le héros de l'article lit cette vidéo à la place de l'image — l'image sociale ci-dessus sert alors d'aperçu (poster). Collez l'URL, pas un code d'intégration.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).warning(
          "Utilisez une URL http(s) YouTube, Vimeo ou de fichier vidéo.",
        ),
    }),
    defineField({
      name: "noIndex",
      title: "Masquer des moteurs de recherche",
      type: "boolean",
      description: "Ajoute robots:noindex + retire l'article du RSS et du plan de site.",
      initialValue: false,
    }),
  ],
});
