import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { MODULE_TYPES } from "./modules";

// A page composes the generic blocks (not the blog-specific ones).
const sectionRefs = MODULE_TYPES.map((type) => ({ type }));

/**
 * Generic editor-driven page — `slug` + `sections[]` of page-builder blocks,
 * rendered by the app's `/[locale]/[...slug]` catch-all via the shared
 * `renderBlock` registry. Per-locale (document-internationalization, like `post`).
 *
 * The **home page** is the same `page` model with `isHome` on (one per locale,
 * fixed id `page-home-<locale>`) — it renders at `/` (the `(home)` route), so there
 * is ONE page model everywhere. `isHome` pages carry no `slug` and are excluded from
 * the catch-all + the sitemap's page list.
 */
export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "isHome",
      title: "Page d'accueil",
      type: "boolean",
      readOnly: true,
      description: "La page d'accueil du site (rendue à la racine « / »). Gérée par le système.",
      initialValue: false,
    }),
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      description: "Nom interne de la page + titre SEO par défaut.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse (slug)",
      type: "slug",
      description: "L'URL de la page. Ex. « a-propos » donne /a-propos.",
      options: { source: "title", maxLength: 96 },
      hidden: ({ document }) => document?.isHome === true,
      // Required for a normal page; the home page (rendered at « / ») needs none.
      validation: (Rule) =>
        Rule.custom((slug, ctx) =>
          (ctx.document as { isHome?: boolean } | undefined)?.isHome ||
          (slug as { current?: string } | undefined)?.current
            ? true
            : "Renseignez une adresse (slug).",
        ),
    }),
    defineField({
      name: "sections",
      title: "Sections de la page",
      description: "Les blocs de la page, dans l'ordre. Ajoutez, réorganisez ou masquez des blocs.",
      type: "array",
      of: sectionRefs,
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title: title || "Page", subtitle: slug ? `/${slug}` : "—" }),
  },
});
