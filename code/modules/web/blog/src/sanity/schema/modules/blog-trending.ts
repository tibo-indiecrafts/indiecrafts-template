import { TrendUpwardIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-trending",
  title: "Articles tendance",
  icon: TrendUpwardIcon,
  description:
    "Les articles les plus populaires ; à défaut de données de popularité, les plus récents.",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({
      name: "count",
      title: "Nombre d'articles",
      type: "number",
      initialValue: 4,
      validation: (Rule) => Rule.min(1).max(12),
      description: "Nombre maximum d'articles affichés.",
    }),
    defineField({
      name: "pinned",
      title: "Articles à mettre en avant en premier",
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
      description:
        "Optionnel. Ces articles apparaissent en premier, dans l'ordre choisi ; les articles tendance complètent la sélection.",
    }),
  ],
});
