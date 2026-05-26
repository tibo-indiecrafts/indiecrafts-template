import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.person-list",
  title: "Person list",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "people",
      title: "People",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
    }),
  ],
});
