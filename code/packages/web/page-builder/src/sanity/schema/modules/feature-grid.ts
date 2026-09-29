/**
 * Define the feature-grid module — a grid of icon feature cards.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/feature-grid.md
 */
import { defineArrayMember, defineField } from "sanity";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { glyphOptions } from "@indiecrafts/packages-web-ui-icons/shared";
import { defineModule } from "../objects/define-module";

/**
 * Feature grid — a title + a grid of icon cards, each with a title and a short
 * body. The icon is chosen from a fixed set (Lucide glyphs the UI ships).
 * Renderer: `FeatureGrid` in `@indiecrafts/packages-web-ui-components/web/collection`.
 */
export default defineModule({
  name: "module.feature-grid",
  title: "Grille de fonctionnalités",
  icon: ThLargeIcon,
  description:
    "Un titre suivi d'une grille de cartes, chacune avec une icône, un titre et un court texte. Idéal pour présenter des atouts ou des fonctionnalités.",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description:
        "Entourez un mot de [[ ]] pour l'afficher dans la couleur d'accent.",
    }),
    defineField({
      name: "intro",
      title: "Intro (optionnel)",
      type: "text",
      rows: 2,
      description: "Court texte sous le titre. Vide = masqué.",
    }),
    defineField({
      name: "items",
      title: "Cartes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          fields: [
            defineField({
              name: "icon",
              title: "Icône",
              type: "string",
              options: { list: glyphOptions() },
              initialValue: "sparkles",
              description: "L'icône affichée en haut de la carte.",
            }),
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Texte",
              type: "text",
              rows: 3,
            }),
          ],
          preview: { select: { title: "title", subtitle: "icon" } },
        }),
      ],
    }),
  ],
});
