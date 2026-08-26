import { ThLargeIcon } from "@sanity/icons";
import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-topic-cards",
  title: "Cartes de sujets",
  icon: ThLargeIcon,
  description:
    "Une à trois catégories ou tags mis en avant sous forme de grandes cartes cliquables.",
  fields: [
    defineField({
      name: "cards",
      title: "Cartes",
      type: "array",
      validation: (Rule) => Rule.min(1).max(3),
      description: "Une à trois cartes. Chacune renvoie vers sa page de catégorie ou de tag.",
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "target",
              title: "Catégorie ou tag",
              type: "reference",
              to: [{ type: "category" }, { type: "tag" }],
              validation: (Rule) => Rule.required(),
              description:
                "La catégorie ou le tag mis en avant. Son titre sert de titre à la carte.",
              options: {
                filter: ({ document }) =>
                  document.language
                    ? {
                        filter: "language == $lang",
                        params: { lang: document.language as string },
                      }
                    : { filter: "" },
              },
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              description: "Grande image affichée en fond de la carte. Vide = fond uni.",
              fields: [
                defineField({
                  name: "alt",
                  title: "Texte alternatif",
                  type: "string",
                  description:
                    "Décrit l'image pour l'accessibilité et le référencement.",
                }),
              ],
            }),
            defineField({
              name: "title",
              title: "Titre (facultatif)",
              type: "string",
              description:
                "Remplace le titre affiché sur la carte. Vide = titre de la catégorie ou du tag.",
            }),
            defineField({
              name: "blurb",
              title: "Description courte",
              type: "text",
              rows: 2,
              description: "Court texte affiché sous le titre. Vide = pas de texte.",
            }),
          ],
          preview: {
            select: { title: "title", targetTitle: "target.title", media: "image" },
            prepare: ({ title, targetTitle, media }) => ({
              title: title || targetTitle || "Sans titre",
              media,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { count: "cards.length", media: "cards.0.image" },
    prepare: ({ count, media }) => ({
      title: count ? `${count} sujet${count > 1 ? "s" : ""}` : "Aucun sujet",
      subtitle: "Cartes de sujets",
      media,
    }),
  },
});
