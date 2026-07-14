import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.person-list",
  title: "Personnes",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "people",
      title: "Personnes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
    }),
  ],
});
