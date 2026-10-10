/**
 * Define the post table-of-contents sidebar card.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/modules/blog-toc.md
 */
import { OlistIcon } from "@sanity/icons/Olist";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

/**
 * The headings of the article being read, with the current one highlighted. A sidebar
 * card for posts only: it shows nothing on other pages or on a post without headings.
 * On a phone the same list opens from a "Sur cette page" button above the article.
 */
export default defineModule({
  name: "module.blog-toc",
  title: "Sommaire de l'article",
  icon: OlistIcon,
  description:
    "Les intertitres de l'article lu. Seulement sur les articles ; sur mobile, il s'ouvre au-dessus du texte.",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description: "Vide = « Sur cette page ».",
    }),
  ],
});
