/**
 * Define the global-schema object for one extra site-wide JSON-LD entity.
 *
 * @see docs/reference/projects/web/website/src/sanity/schema/objects/global-schema.md
 */

import { defineField, defineType } from "sanity";

/**
 * One extra site-wide JSON-LD entity, added to the site `@graph` alongside the
 * auto-emitted Organization + WebSite. The editor picks a `schemaType`; the
 * front-end maps it through the matching factory in
 * `src/lib/seo/jsonld-factories.tsx` (`buildServiceSchema`, `buildProductSchema`,
 * `buildPersonSchema`, …). A curated subset — not the full schema.org space.
 *
 * Lives in `siteSettings.globalSchemas[]` and is the SOLE source for these
 * (no `globalSchemas` config fallback).
 */
export default defineType({
  name: "globalSchema",
  title: "Information pour Google",
  type: "object",
  fields: [
    defineField({
      name: "schemaType",
      title: "Type d'information",
      type: "string",
      description:
        "Ce que décrit cette information. Aide Google à afficher une fiche enrichie.",
      options: {
        list: [
          { title: "Service", value: "Service" },
          { title: "Produit (Product)", value: "Product" },
          { title: "Personne (Person)", value: "Person" },
          { title: "Événement (Event)", value: "Event" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Texte alternatif", type: "string" })],
    }),
    // Optional Offer — Service / Product only. Ignored by Person / Event.
    defineField({
      name: "price",
      title: "Prix (pour un service ou produit)",
      type: "string",
      description: "Ex. « 1200 ». Laissez vide s'il n'y a pas de prix affiché.",
    }),
    defineField({
      name: "priceCurrency",
      title: "Devise",
      type: "string",
      description: "Ex. « EUR ». À remplir seulement si un prix est indiqué.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "schemaType", media: "image" },
  },
});
