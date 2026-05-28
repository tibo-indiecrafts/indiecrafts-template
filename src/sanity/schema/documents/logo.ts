import { defineField, defineType } from "sanity";

/** Logo de marque utilisé par le module Logo List (« ils nous font confiance »). */
export default defineType({
  name: "logo",
  title: "Logo",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom de la marque",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image du logo",
      type: "image",
      options: { hotspot: true },
      description: "SVG recommandé. Conservez un fond transparent.",
    }),
    defineField({
      name: "url",
      title: "URL du lien",
      type: "url",
      description: "Optionnel — pour lier le logo au site de la marque.",
    }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
