import { ImageIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-hero",
  title: "Grande une",
  icon: ImageIcon,
  description: "Un grand article mis en avant, en pleine largeur.",
  fields: [
    defineField({
      name: "source",
      title: "Article affiché",
      type: "string",
      options: {
        list: [
          { title: "Dernier article publié", value: "latest" },
          { title: "Article choisi", value: "pinned" },
        ],
        layout: "radio",
      },
      initialValue: "latest",
      description:
        "« Dernier article publié » se met à jour automatiquement. « Article choisi » fige un article précis.",
    }),
    defineField({
      name: "pinned",
      title: "Article à mettre en avant",
      type: "reference",
      to: [{ type: "post" }],
      hidden: ({ parent }) => parent?.source !== "pinned",
      description:
        "L'article affiché quand « Article choisi » est sélectionné.",
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
      name: "showMeta",
      title: "Afficher l'auteur·rice et la date",
      type: "boolean",
      initialValue: true,
      description: "Vide = affiché.",
    }),
  ],
});
