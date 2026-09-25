/**
 * Define the prose module — a rich-text block with a width option.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/prose.md
 */
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.prose",
  title: "Prose",
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
