import { FolderIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-category-spotlight",
  title: "Coup de projecteur catégorie",
  icon: FolderIcon,
  description: "Une sélection d'articles d'une catégorie, avec un lien « Tout voir ».",
  fields: [
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
      description: "La catégorie mise en avant. Son titre sert de titre à la section.",
      options: {
        filter: ({ document }) =>
          document.language
            ? {
                filter: "language == $lang",
                params: { lang: document.language as string },
              }
            : { filter: "" },
      },
    }),
    defineField({
      name: "heading",
      title: "Titre",
      type: "string",
      description: "Remplace le titre par défaut. Vide = titre de la catégorie.",
    }),
    defineField({
      name: "subheading",
      title: "Sous-titre",
      type: "text",
      description: "Vide = pas de sous-titre.",
    }),
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
        "Optionnel. Ces articles apparaissent en premier, dans l'ordre choisi ; les articles les plus récents de la catégorie complètent la sélection.",
    }),
  ],
});
