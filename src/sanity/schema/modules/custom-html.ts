import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.custom-html",
  title: "Custom HTML",
  fields: [
    defineField({
      name: "html",
      title: "HTML",
      type: "text",
      rows: 12,
      description:
        "Raw HTML embedded as-is. Use sparingly — content is rendered with dangerouslySetInnerHTML.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Custom HTML" }) },
});
