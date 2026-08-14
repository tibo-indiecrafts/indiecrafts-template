import { defineField, defineType } from "sanity";
import { pages } from "@/config";

/**
 * Per-page SEO override — one entry per static route in the `pages` map
 * (`@indiecrafts/config`). Lives in the `pageSeo[]` array of the per-locale `siteMeta`
 * singleton, so an editor controls each page's `<title>` / description /
 * keywords / share card **per language** from the Studio.
 *
 * This is the SOLE source for static-page SEO text at runtime (no config
 * fallback) — see `getSiteSeo` in `src/lib/seo/site-seo.ts`. Blog post +
 * taxonomy detail pages are NOT here; they carry their own doc-level
 * `metadata` / `seoMeta`.
 */
export default defineType({
  name: "pageSeo",
  title: "SEO d'une page",
  type: "object",
  fields: [
    defineField({
      name: "pageId",
      title: "Page",
      type: "string",
      options: {
        // Kept in sync with the routes automatically — the `pages` map is the
        // single source of truth for which static pages exist.
        list: Object.values(pages).map((p) => ({ title: p.id, value: p.id })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titre SEO",
      type: "string",
      description: "Jusqu'à ~60 caractères. Le lien bleu cliquable dans Google.",
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
        "Le texte gris sous le titre dans Google. ~160 caractères max, sinon coupé.",
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
      name: "ogImage",
      title: "Image de partage (optionnelle)",
      type: "image",
      options: { hotspot: true },
      description:
        "Carte 1200×630 propre à cette page. Vide = image de partage par défaut de la langue.",
      fields: [defineField({ name: "alt", title: "Texte alternatif", type: "string" })],
    }),
    defineField({
      name: "schemaImage",
      title: "Image pour Google (optionnelle)",
      type: "image",
      options: { hotspot: true },
      description:
        "Image que Google peut afficher à côté du résultat. Vide = l'image de partage est utilisée.",
      fields: [defineField({ name: "alt", title: "Texte alternatif", type: "string" })],
    }),
    defineField({
      name: "canonical",
      title: "Adresse officielle de la page (optionnelle)",
      type: "url",
      description:
        "À remplir seulement si cette page est un doublon d'une autre : indiquez l'adresse de l'originale. Sinon, laissez vide.",
    }),
    defineField({
      name: "noindex",
      title: "Masquer des moteurs de recherche",
      type: "boolean",
      description:
        "Activé, la page n'apparaît plus dans Google, ni dans le plan du site, ni pour les assistants IA. Elle reste accessible par son lien.",
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
      name: "llmsSummary",
      title: "Résumé pour les IA (llms.txt)",
      type: "text",
      rows: 4,
      description:
        "Texte libre : décrivez la page pour l'index /llms.txt. Affiché comme une ligne de résumé (les sauts de ligne sont aplatis). Vide = la description SEO. Pour du contenu long, utilisez « Contenu complet » ci-dessous.",
    }),
    defineField({
      name: "llmsFull",
      title: "Contenu complet pour les IA (llms-full)",
      type: "text",
      rows: 10,
      description:
        "Texte (Markdown) que les assistants IA liront pour cette page, sur /llms-full.txt et /llms/<page>. Vide = seuls le titre et la description sont exposés.",
    }),
  ],
  preview: {
    select: { pageId: "pageId", title: "title", media: "ogImage" },
    prepare: ({ pageId, title, media }) => ({
      title: pageId ?? "(page)",
      subtitle: title,
      media,
    }),
  },
});
