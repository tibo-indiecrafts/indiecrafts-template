import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.hero-split",
  title: "Hero (deux colonnes)",
  fields: [
    defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "content", title: "Contenu", type: "blockContent" }),
    defineField({
      name: "ctas",
      title: "Boutons d'appel à l'action",
      type: "array",
      of: [defineArrayMember({ type: "cta" })],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "imagePosition",
      title: "Position de l'image",
      type: "string",
      options: {
        list: [
          { title: "Droite", value: "right" },
          { title: "Gauche", value: "left" },
        ],
        layout: "radio",
      },
      initialValue: "right",
    }),
  ],
});
