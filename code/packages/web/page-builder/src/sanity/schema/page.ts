/**
 * Defines the generic page document — slug plus an ordered array of page-builder blocks.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/page.md
 */
import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";
import { MODULE_TYPES } from "./modules";
import { blockInsertMenu } from "./objects/insert-menu";

/**
 * Generic editor-driven page — `slug` + `sections[]` of page-builder blocks (the generic
 * ones + the app's `sectionTypes`) + an optional `sidebar`, rendered by the app's
 * `/[locale]/[...slug]` catch-all. Per-locale (document-internationalization, like `post`).
 *
 * The **home page** is the same `page` model with `isHome` on (one per locale,
 * fixed id `page-home-<locale>`) — it renders at `/` (the `(home)` route), so there
 * is ONE page model everywhere. `isHome` pages carry no `slug` and are excluded from
 * the catch-all + the sitemap's page list.
 */
export function definePage({
  sectionTypes = [],
}: {
  /** Blocks the app adds to `sections[]` on top of the generic ones (e.g. the blog's). */
  sectionTypes?: readonly string[];
} = {}) {
  const types = [...MODULE_TYPES, ...sectionTypes];
  return defineType({
    name: "page",
    title: "Page",
    type: "document",
    icon: DocumentIcon,
    fields: [
      defineField({
        name: "language",
        type: "string",
        readOnly: true,
        hidden: true,
      }),
      defineField({
        name: "isHome",
        title: "Page d'accueil",
        type: "boolean",
        readOnly: true,
        description:
          "La page d'accueil du site (rendue à la racine « / »). Gérée par le système.",
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
        options: {
          source: "title",
          maxLength: 96,
          // A translation starts with a blank slug (its own per-locale URL), not a
          // copy of the source — matches post/author/category/tag/series.
          documentInternationalization: { exclude: true },
        },
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
        description:
          "Les blocs de la page, dans l'ordre. Ajoutez, réorganisez ou masquez des blocs.",
        type: "array",
        of: types.map((type) => ({ type })),
        options: { insertMenu: blockInsertMenu(types) },
      }),
      defineField({
        name: "sidebar",
        title: "Barre latérale",
        type: "sidebar",
      }),
      defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
    ],
    preview: {
      select: { title: "title", slug: "slug.current" },
      prepare: ({ title, slug }) => ({
        title: title || "Page",
        subtitle: slug ? `/${slug}` : "—",
      }),
    },
  });
}
