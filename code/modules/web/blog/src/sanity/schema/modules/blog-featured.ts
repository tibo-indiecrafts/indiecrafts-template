import { StarIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-featured",
  title: "Articles à la une",
  icon: StarIcon,
  description:
    "Un article mis en avant en grand, suivi d'une sélection d'articles.",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({
      name: "source",
      title: "Articles affichés",
      type: "string",
      options: {
        list: [
          { title: "Articles marqués « Mis en avant »", value: "flag" },
          { title: "Articles choisis", value: "pinned" },
        ],
        layout: "radio",
      },
      initialValue: "flag",
      description:
        "« Articles marqués » se met à jour automatiquement. « Articles choisis » fige une sélection précise, dans l'ordre choisi ci-dessous.",
    }),
    defineField({
      name: "pinned",
      title: "Articles choisis",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
          options: {
            filter: ({ document }) =>
              document.language
                ? {
                    filter: "language == $lang",
                    params: { lang: document.language as string },
                  }
                : { filter: "" },
          },
        },
      ],
      hidden: ({ parent }) => parent?.source !== "pinned",
      description:
        "Les articles affichés quand « Articles choisis » est sélectionné, dans l'ordre d'affichage.",
    }),
    defineField({
      name: "limit",
      title: "Limite",
      type: "number",
      initialValue: 4,
      validation: (Rule) => Rule.min(1).max(20),
      description: "Nombre maximum d'articles affichés.",
    }),
    defineField({
      name: "leadCard",
      title: "Premier article en grand",
      type: "boolean",
      initialValue: true,
      description:
        "Affiche le premier article en grand format ; les autres dans une grille.",
    }),
  ],
});
