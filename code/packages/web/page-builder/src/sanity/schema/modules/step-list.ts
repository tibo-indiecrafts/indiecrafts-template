/**
 * Defines the step-list page-builder module — an ordered list of titled steps with rich content.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/step-list.md
 */
import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.step-list",
  title: "Étapes",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "steps",
      title: "Étapes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
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
