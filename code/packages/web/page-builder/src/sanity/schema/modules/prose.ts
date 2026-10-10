/**
 * Define the prose module — a rich-text block with a width option.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/prose.md
 */
import { TextIcon } from "@sanity/icons/Text";
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.prose",
  title: "Prose",
  icon: TextIcon,
  description: "Un bloc de texte riche, en colonne étroite ou large.",
  fields: [
    defineField({
      name: "content",
      title: "Contenu",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "width",
      title: "Largeur",
      type: "string",
      options: {
        list: [
          { title: "Étroite (article)", value: "narrow" },
          { title: "Large", value: "wide" },
        ],
        layout: "radio",
      },
      initialValue: "narrow",
    }),
  ],
  preview: { prepare: () => ({ title: "Prose" }) },
});
