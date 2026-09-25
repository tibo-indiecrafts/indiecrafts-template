/**
 * Defines the cta object — a styled call-to-action link with a variant.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/objects/cta.md
 */
import { defineField, defineType } from "sanity";

/**
 * Appel à l'action — un lien stylisé avec une variante. Réutilisé dans
 * plusieurs modules (hero, callout, card-list, etc.).
 */
export default defineType({
  name: "cta",
  title: "Appel à l'action",
  type: "object",
  fields: [
    defineField({ name: "link", title: "Lien", type: "link" }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Primaire", value: "primary" },
          { title: "Secondaire", value: "secondary" },
          { title: "Discret", value: "ghost" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
});
