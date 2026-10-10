/**
 * Define the card-list module — a grid of image cards with a CTA.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/card-list.md
 */
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.card-list",
  title: "Cartes",
  icon: ThLargeIcon,
  description: "Une grille de cartes avec image, texte et bouton.",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "columns",
      title: "Colonnes",
      type: "number",
      description: "Nombre de cartes par ligne sur desktop. Par défaut 3.",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: "cards",
      title: "Cartes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Contenu",
              type: "blockContent",
            }),
            defineField({ name: "image", title: "Image", type: "image" }),
            defineField({
              name: "cta",
              title: "Appel à l'action",
              type: "cta",
            }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),
  ],
});
