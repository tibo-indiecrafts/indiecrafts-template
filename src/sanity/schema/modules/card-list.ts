import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.card-list",
  title: "Liste de cartes",
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
            defineField({ name: "content", title: "Contenu", type: "blockContent" }),
            defineField({ name: "image", title: "Image", type: "image" }),
            defineField({ name: "cta", title: "Appel à l'action", type: "cta" }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),
  ],
});
