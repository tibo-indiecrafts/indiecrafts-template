import { defineField, defineType } from "sanity";
import { MenuIcon } from "@sanity/icons";

/**
 * Navigation — a single, language-independent singleton (`_id: navigation`) that
 * owns the header menu and the footer columns. One shared structure; each link's
 * label is a `localeString` (per-language text), so reordering/renaming a menu
 * item changes every language at once.
 *
 * SOLE runtime source for the menus (no `@indiecrafts/packages-shared-config` fallback) — read by
 * `getNavigation` (`src/lib/navigation.ts`) and rendered by the Header/Footer.
 * Empty = the header shows just the logo and the footer just the social block.
 */
export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "header",
      title: "Menu de l'en-tête",
      type: "array",
      of: [{ type: "navItem" }],
      description:
        "Les liens de la barre en haut du site, dans l'ordre. Vide = seul le logo s'affiche.",
    }),
    defineField({
      name: "footerColumns",
      title: "Colonnes du pied de page",
      type: "array",
      description:
        "Chaque colonne a un titre et une liste de liens. Vide = le pied de page n'affiche que le bloc « Nous suivre ».",
      of: [
        {
          type: "object",
          name: "footerColumn",
          title: "Colonne",
          icon: MenuIcon,
          fields: [
            defineField({
              name: "title",
              title: "Titre de la colonne",
              type: "localeString",
              description: "L'intitulé au-dessus des liens. Une ligne par langue.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "links",
              title: "Liens",
              type: "array",
              of: [{ type: "navItem" }],
            }),
          ],
          preview: {
            select: { links: "links" },
            prepare: ({ links }) => ({
              title: "Colonne",
              subtitle: `${(links ?? []).length} lien(s)`,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Navigation" }),
  },
});
