/**
 * Define the related-posts sidebar card.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/modules/blog-related.md
 */
import { LinkIcon } from "@sanity/icons/Link";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

/**
 * Other articles on the same topic as the one being read, with a link to its category.
 * A sidebar card for posts only: it shows nothing on other pages.
 */
export default defineModule({
  name: "module.blog-related",
  title: "Articles sur le même sujet",
  icon: LinkIcon,
  description:
    "D'autres articles de la même catégorie que l'article lu. Seulement sur les articles.",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description: "Vide = « Plus sur <catégorie> ».",
    }),
    defineField({
      name: "limit",
      title: "Nombre d'articles",
      type: "number",
      initialValue: 4,
      validation: (Rule) => Rule.min(1).max(8).integer(),
    }),
  ],
});
