import { defineArrayMember, defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";
import { defineModule } from "../objects/define-module";

/**
 * Image gallery — a swipeable carousel with a thumbnail strip and an image
 * counter, plus click-to-zoom fullscreen. Inline-embeddable in a post body.
 * The renderer is `GalleryCarousel` (client, embla); the GROQ projection lives
 * in `MODULES_FRAGMENT` (`_type == "module.gallery"`), resolving each image to
 * its CDN url + `lqip`/dimensions for a blurred placeholder.
 */
export default defineModule({
  name: "module.gallery",
  title: "Galerie d'images",
  icon: ImagesIcon,
  description:
    "Un carrousel d'images avec des miniatures de navigation et un compteur (ex. « 03 / 12 »). Le visiteur fait glisser, clique les miniatures ou les flèches, et peut cliquer une image pour l'agrandir en plein écran. S'adapte à toutes les tailles d'écran.",
  fields: [
    defineField({
      name: "title",
      title: "Titre (optionnel)",
      type: "string",
      description:
        "Petit titre affiché au-dessus de la galerie. Entourez un mot de [[ ]] pour l'afficher dans la couleur d'accent, ex. « Nos [[derniers]] projets ». Laissez vide pour aucun.",
    }),
    defineField({
      name: "intro",
      title: "Intro (optionnel)",
      type: "text",
      rows: 2,
      description: "Court texte d'introduction sous le titre.",
    }),
    defineField({
      name: "ratio",
      title: "Format des images",
      type: "string",
      options: {
        list: [
          { title: "Paysage 3:2 (défaut)", value: "3:2" },
          { title: "Paysage 4:3", value: "4:3" },
          { title: "Panoramique 16:9", value: "16:9" },
          { title: "Carré 1:1", value: "1:1" },
          { title: "Portrait 4:5", value: "4:5" },
        ],
        layout: "radio",
      },
      initialValue: "3:2",
      description:
        "Le cadre dans lequel toutes les images s'affichent dans le carrousel (recadrées pour le remplir). En plein écran, chaque image est montrée en entier, sans recadrage.",
    }),
    defineField({
      name: "images",
      title: "Images (glisser pour réordonner)",
      type: "array",
      description: "Le carrousel et les miniatures s'affichent dans cet ordre.",
      validation: (Rule) => Rule.min(1).error("Ajoutez au moins une image."),
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              description:
                "Décrit l'image pour l'accessibilité et le référencement. Laissez vide si l'image est purement décorative.",
            }),
          ],
          preview: {
            select: { media: "asset", title: "alt" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", count: "images.length", media: "images.0.asset" },
    prepare({ title, count, media }) {
      return {
        title: title || "Galerie d'images",
        subtitle: count ? `${count} image${count > 1 ? "s" : ""}` : "Aucune image",
        media,
      };
    },
  },
});
