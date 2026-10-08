/**
 * Define the Sanity document schema for a blog author.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/author.md
 */
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Auteur",
  type: "document",
  fields: [
    defineField({
      // Géré par @sanity/document-internationalization : masqué + lecture
      // seule (le plugin écrit la valeur à la création).
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      initialValue: "en",
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "position", title: "Poste", type: "string" }),
    defineField({
      name: "slug",
      title: "Adresse web",
      type: "slug",
      description:
        "La fin de l'adresse de sa page auteur (ex. marie-dupont). Minuscules et tirets. « Générer » la crée depuis le nom.",
      // `exclude` : une traduction démarre avec un slug vide, pas une copie
      // du slug source — chaque locale a sa propre URL.
      options: {
        source: "name",
        maxLength: 96,
        documentInternationalization: { exclude: true },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Biographie",
      type: "array",
      of: [
        {
          title: "Bloc",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    }),
    defineField({
      name: "social",
      title: "Réseaux sociaux",
      description:
        "Liens affichés sur la page de l'auteur·rice. Vide = aucun lien.",
      type: "array",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Plateforme",
              type: "string",
              options: {
                list: [
                  { title: "X (Twitter)", value: "x" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "GitHub", value: "github" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Mastodon", value: "mastodon" },
                  { title: "Site web", value: "website" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Lien",
              type: "url",
              description: "Ex. « https://x.com/pseudo ».",
              validation: (Rule) =>
                Rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
  ],
  preview: {
    select: { title: "name", language: "language", media: "image" },
    prepare: ({ title, language, media }) => ({
      title,
      subtitle: language?.toUpperCase(),
      media,
    }),
  },
});
