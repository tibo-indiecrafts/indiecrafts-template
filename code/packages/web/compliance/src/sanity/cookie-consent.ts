/**
 * Defines the Sanity singleton document schema for cookie consent content.
 *
 * @see docs/reference/packages/web/compliance/src/sanity/cookie-consent.md
 */

import { defineField, defineType } from "sanity";
import { RemoveCircleIcon } from "@sanity/icons/RemoveCircle";

/**
 * Cookie consent — a single, language-independent singleton (`_id: cookieConsent`)
 * that drives the cookie banner + preferences dialog + the cookie-policy table.
 * The master on/off (`requireCookieConsent`) and the GA id live in
 * `siteSettings.analytics`; this doc holds the *content*: banner copy, the consent
 * categories (with their Consent-Mode signal mapping), and the cookie inventory.
 *
 * SOLE runtime source (no config fallback) — read by `getCookieConsent`
 * (`src/lib/cookies.ts`). Bump `version` to re-prompt every visitor.
 */
export default defineType({
  name: "cookieConsent",
  title: "Cookies & consentement",
  type: "document",
  icon: RemoveCircleIcon,
  __experimental_omnisearch_visibility: false,
  groups: [
    { name: "banner", title: "Bannière", default: true },
    { name: "categories", title: "Catégories" },
    { name: "inventory", title: "Liste des cookies" },
  ],
  fields: [
    defineField({
      name: "version",
      title: "Version du consentement",
      type: "string",
      group: "banner",
      description:
        "Changez cette valeur (ex. « 1 » → « 2 ») après une modification importante pour redemander le consentement à tous les visiteurs.",
      initialValue: "1",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "banner",
      title: "Texte de la bannière",
      type: "object",
      group: "banner",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Titre",
          type: "localeString",
          description: "Le titre de la bannière. Une ligne par langue.",
        }),
        defineField({
          name: "body",
          title: "Texte",
          type: "localeString",
          description:
            "La phrase d'explication sous le titre. Une ligne par langue.",
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Catégories de consentement",
      type: "array",
      group: "categories",
      of: [{ type: "cookieCategory" }],
      description:
        "Les groupes que le visiteur peut accepter ou refuser. Mettez « Nécessaires » (obligatoire) en premier, puis les catégories optionnelles.",
    }),
    defineField({
      name: "cookies",
      title: "Liste des cookies",
      type: "array",
      group: "inventory",
      of: [{ type: "cookieEntry" }],
      description:
        "Le tableau affiché sur la page « Politique de cookies ». Chaque cookie est rattaché à une catégorie.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Cookies & consentement" }),
  },
});
