/**
 * Define the accordion-list module — a titled list of expandable items.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/accordion-list.md
 */
import { ThListIcon } from "@sanity/icons/ThList";
import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.accordion-list",
  title: "Accordéon",
  icon: ThListIcon,
  description: "Des questions-réponses dépliables (FAQ).",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      title: "Éléments",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "item",
          fields: [
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Contenu",
              type: "blockContent",
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
});
