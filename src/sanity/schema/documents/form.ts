import { defineField, defineType } from "sanity";

/**
 * Form definition used by the Form module. The schema describes the
 * shape; rendering is handled by Netlify Forms (see `public/__forms.html`).
 * For each form you create here, add a matching `<form>` declaration to
 * `public/__forms.html` so Netlify's build-time scanner picks it up.
 */
export default defineType({
  name: "form",
  title: "Form",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Form name",
      type: "string",
      description:
        "Matches the `name` attribute in public/__forms.html (e.g. 'contact', 'newsletter').",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "title", title: "Display title", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "submitLabel",
      title: "Submit button label",
      type: "string",
      initialValue: "Send",
    }),
    defineField({
      name: "fields",
      title: "Fields",
      type: "array",
      of: [
        {
          type: "object",
          name: "field",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "Email", value: "email" },
                  { title: "Textarea", value: "textarea" },
                  { title: "Tel", value: "tel" },
                  { title: "URL", value: "url" },
                ],
              },
              initialValue: "text",
            }),
            defineField({ name: "required", title: "Required", type: "boolean" }),
          ],
          preview: { select: { title: "label", subtitle: "type" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "name" } },
});
