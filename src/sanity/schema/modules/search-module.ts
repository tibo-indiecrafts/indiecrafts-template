import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.search",
  title: "Search",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Search posts",
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder",
      type: "string",
      initialValue: "Search…",
    }),
    defineField({
      name: "scope",
      title: "Scope",
      type: "string",
      options: {
        list: [{ title: "Blog posts", value: "post" }],
        layout: "radio",
      },
      initialValue: "post",
      description: "Posts only for now. Extend the SearchModule renderer to add scopes.",
    }),
  ],
  preview: { prepare: () => ({ title: "Search" }) },
});
