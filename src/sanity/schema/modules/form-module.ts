import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.form",
  title: "Formulaire",
  fields: [
    defineField({
      name: "form",
      title: "Formulaire",
      type: "reference",
      to: [{ type: "form" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titre (remplace celui du formulaire)",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Intro (remplace celle du formulaire)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "form.title", subtitle: "form.name" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "(formulaire)",
      subtitle: subtitle ? `nom : ${subtitle}` : undefined,
    }),
  },
});
