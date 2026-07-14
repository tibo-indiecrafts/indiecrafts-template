import { defineField, defineArrayMember } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.breadcrumbs",
  title: "Fil d'ariane",
  fields: [
    defineField({
      name: "label",
      title: "Libellé aria",
      type: "string",
      description:
        "Optionnel. Définit `aria-label` sur la nav du fil d'ariane. Laissez vide pour utiliser la valeur localisée par défaut (messages/<locale>.json).",
    }),
    defineField({
      name: "items",
      title: "Éléments",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "crumb",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Lien (href)",
              type: "string",
              description:
                "Chemin comme « /blog » ou « / » — laissez vide pour la page courante.",
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Fil d'ariane" }) },
});
