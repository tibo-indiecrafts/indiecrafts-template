import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.stat-list",
  title: "Statistiques",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "stats",
      title: "Statistiques",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "value",
              title: "Valeur",
              type: "string",
              description: "Ex. « 12k+ », « 99,9 % », « 1,4 M€ »",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "label", title: "Libellé", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
  ],
});
