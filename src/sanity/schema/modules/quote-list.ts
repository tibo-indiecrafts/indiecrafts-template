import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.quote-list",
  title: "Quote list",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "quotes",
      title: "Quotes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "quote" }] }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
