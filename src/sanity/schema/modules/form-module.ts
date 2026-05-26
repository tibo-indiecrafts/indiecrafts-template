import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.form",
  title: "Form",
  fields: [
    defineField({
      name: "form",
      title: "Form",
      type: "reference",
      to: [{ type: "form" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "title", title: "Override title", type: "string" }),
    defineField({ name: "intro", title: "Override intro", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "form.title", subtitle: "form.name" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "(form)",
      subtitle: subtitle ? `name: ${subtitle}` : undefined,
    }),
  },
});
