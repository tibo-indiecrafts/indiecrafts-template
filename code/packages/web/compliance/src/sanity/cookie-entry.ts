/**
 * Defines the Sanity object schema for one cookie declaration row.
 *
 * @see docs/reference/packages/web/compliance/src/sanity/cookie-entry.md
 */

import { defineField, defineType } from "sanity";
import { defaultLocale } from "@indiecrafts/packages-shared-config";

/**
 * One row of the cookie declaration table shown on the cookie-policy page — a
 * real cookie the site (or a third party) sets, grouped by its `categoryKey`.
 */
const CATEGORY_KEYS = [
  { title: "Nécessaires", value: "necessary" },
  { title: "Mesure d'audience", value: "analytics" },
  { title: "Marketing / publicité", value: "marketing" },
  { title: "Préférences", value: "preferences" },
];

export default defineType({
  name: "cookieEntry",
  title: "Cookie",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nom du cookie",
      type: "string",
      description: "Le nom technique, ex. « _ga ».",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "provider",
      title: "Fournisseur",
      type: "string",
      description:
        "Qui dépose le cookie, ex. « Google Analytics » ou le nom de votre site.",
    }),
    defineField({
      name: "categoryKey",
      title: "Catégorie",
      type: "string",
      options: { list: CATEGORY_KEYS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "purpose",
      title: "Finalité",
      type: "localeString",
      description:
        "À quoi sert ce cookie, en une phrase. Une ligne par langue.",
    }),
    defineField({
      name: "duration",
      title: "Durée de conservation",
      type: "string",
      description: "Combien de temps il reste, ex. « 13 mois », « Session ».",
    }),
    defineField({
      name: "party",
      title: "Origine",
      type: "string",
      options: {
        list: [
          { title: "Première partie (votre site)", value: "first" },
          { title: "Tierce partie (service externe)", value: "third" },
        ],
        layout: "radio",
      },
      initialValue: "first",
    }),
  ],
  preview: {
    select: {
      name: "name",
      provider: "provider",
      purpose: `purpose.${defaultLocale}`,
    },
    prepare: ({ name, provider, purpose }) => ({
      title: name,
      subtitle: [provider, purpose].filter(Boolean).join(" · "),
    }),
  },
});
