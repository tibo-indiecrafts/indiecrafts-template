import { SearchIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-explore",
  title: "Explorer",
  icon: SearchIcon,
  description:
    "Catégories, tags ou auteurs·rices à explorer, avec un lien vers chaque page.",
  fields: [
    defineField({
      name: "variant",
      title: "Contenu affiché",
      type: "string",
      options: {
        list: [
          { title: "Catégories", value: "categories" },
          { title: "Tags", value: "tags" },
          { title: "Auteurs·rices", value: "authors" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
      description: "Le type de contenu à explorer dans ce bloc.",
    }),
    defineField({
      name: "heading",
      title: "Titre",
      type: "string",
      description:
        "Remplace le titre par défaut. Vide = titre standard du blog.",
    }),
    defineField({
      name: "subheading",
      title: "Sous-titre",
      type: "text",
      rows: 2,
      description: "Remplace le sous-titre par défaut. Vide = texte standard.",
    }),
    defineField({
      name: "viewAll",
      title: "Texte du lien « Voir tout »",
      type: "string",
      description: "Remplace le texte du bouton. Vide = texte standard.",
    }),
  ],
});
