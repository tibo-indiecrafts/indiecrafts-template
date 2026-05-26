import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.logo-list",
  title: "Logo list",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "logo" }] }],
    }),
  ],
});
