import { defineField, defineArrayMember } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.breadcrumbs",
  title: "Breadcrumbs",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "crumb",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Href",
              type: "string",
              description: "Path like '/blog' or '/' — leave blank for current page.",
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Breadcrumbs" }) },
});
