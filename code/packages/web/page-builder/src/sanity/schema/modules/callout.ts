/**
 * Define the callout module — a coloured note with rich content and a CTA.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/callout.md
 */
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.callout",
  title: "Encadré",
  fields: [
    defineField({
      name: "variant",
      title: "Variante",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Succès", value: "success" },
          { title: "Avertissement", value: "warning" },
          { title: "Danger", value: "danger" },
        ],
        layout: "radio",
      },
      initialValue: "info",
    }),
    defineField({
      name: "content",
      title: "Contenu",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "cta", title: "Appel à l'action", type: "cta" }),
  ],
  preview: {
    select: { variant: "variant" },
    prepare: ({ variant }) => ({ title: `Encadré (${variant ?? "info"})` }),
  },
});
