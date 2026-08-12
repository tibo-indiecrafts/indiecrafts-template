import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";
import { pages, defaultLocale } from "@indiecrafts/config";

/**
 * A single reusable menu link — used in the header bar and in every footer
 * column (see `navigation`). Two kinds, toggled by `linkType`:
 *
 *   - "internal" → points at one of the site's own pages (the `route` dropdown,
 *     built from the `pages` map so a link can't target a route that doesn't
 *     exist). The final URL is resolved per language at render time.
 *   - "external" → a full URL to another website (`external`).
 *
 * The label is a `localeString` (one line per language). Best-practice per
 * Sanity's navigation guidance: an internal/external toggle + an internal
 * *reference* (here, the typed route key) so links survive slug changes.
 *
 * Header extras (ignored in the footer): an optional `icon` (free-text Reicon
 * name) + `description` for rich dropdown links, and an optional `children`
 * submenu — a header item with children renders as a dropdown (its own link is
 * ignored; the label becomes the trigger). Only one level of submenu is shown.
 */

/** Human labels for the route dropdown — keyed by `pages.<key>.id`. */
const ROUTE_LABELS: Record<string, string> = {
  home: "Accueil",
  "legal-notice": "Mentions légales",
  privacy: "Politique de confidentialité",
  cookies: "Politique de cookies",
  terms: "Conditions générales d'utilisation (CGU)",
  "terms-of-sale": "Conditions générales de vente (CGV)",
  blog: "Blog",
  author: "Auteurs",
  category: "Catégories",
  tag: "Tags",
};

const ROUTE_OPTIONS = Object.values(pages).map((page) => ({
  title: ROUTE_LABELS[page.id] ?? page.key,
  value: page.key,
}));

export default defineType({
  name: "navItem",
  title: "Lien de menu",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Texte du lien",
      type: "localeString",
      description: "Ce que le visiteur lit. Une ligne par langue.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Type de lien",
      type: "string",
      description: "Vers une page de ce site, ou vers une adresse externe.",
      options: {
        list: [
          { title: "Page du site", value: "internal" },
          { title: "URL externe", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "route",
      title: "Page du site",
      type: "string",
      description: "La page vers laquelle pointe le lien.",
      options: { list: ROUTE_OPTIONS },
      hidden: ({ parent }) => parent?.linkType !== "internal",
    }),
    defineField({
      name: "external",
      title: "Adresse (URL)",
      type: "url",
      description: "Adresse complète, ex. « https://exemple.com ».",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto"] }),
      hidden: ({ parent }) => parent?.linkType !== "external",
    }),
    defineField({
      name: "newTab",
      title: "Ouvrir dans un nouvel onglet",
      type: "boolean",
      description: "Recommandé pour les liens externes.",
      initialValue: false,
    }),
    defineField({
      name: "icon",
      title: "Icône (optionnel)",
      type: "string",
      description:
        "Nom d'icône Reicon, ex. « ShieldCheck ». Visible dans les menus déroulants de l'en-tête. Liste des noms : reicon.dev. Vide = pas d'icône.",
    }),
    defineField({
      name: "description",
      title: "Description (optionnel)",
      type: "localeString",
      description:
        "Courte phrase affichée sous le lien dans un menu déroulant de l'en-tête. Une ligne par langue.",
    }),
    defineField({
      name: "children",
      title: "Sous-menu déroulant (optionnel)",
      type: "array",
      of: [{ type: "navItem" }],
      description:
        "Ajoutez des liens ici pour transformer cet élément en menu déroulant (en-tête uniquement). Le lien de l'élément lui-même est alors ignoré — son texte devient le titre du menu.",
    }),
  ],
  preview: {
    select: {
      label: `label.${defaultLocale}`,
      linkType: "linkType",
      route: "route",
      external: "external",
      children: "children",
    },
    prepare: ({ label, linkType, route, external, children }) => {
      const count = Array.isArray(children) ? children.length : 0;
      return {
        title: label || "(sans texte)",
        subtitle: count > 0 ? `Menu déroulant · ${count} lien(s)` : linkType === "external" ? external : route,
      };
    },
  },
});
