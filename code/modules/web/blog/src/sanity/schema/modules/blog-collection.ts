/**
 * Define the collection-carousel page-builder module schema.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/modules/blog-collection.md
 */
import { PresentationIcon } from "@sanity/icons/Presentation";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-collection",
  title: "Carrousel d'articles",
  icon: PresentationIcon,
  description:
    "Une sélection d'articles choisis à la main, affichés en carrousel.",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 2,
      description: "Vide = pas de texte d'introduction.",
    }),
    defineField({
      name: "posts",
      title: "Articles",
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
      validation: (Rule) => Rule.required().min(1),
      description:
        "Les articles affichés dans le carrousel, dans l'ordre choisi.",
    }),
  ],
});
