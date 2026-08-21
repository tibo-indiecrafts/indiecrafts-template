import { defineArrayMember, defineField } from "sanity";
import { CreditCardIcon } from "@sanity/icons";
import { defineModule } from "../objects/define-module";

/**
 * Pricing — a title + a row of plan tiers, each with a name, price, period,
 * a feature list, and a call-to-action. Mark one tier as highlighted to give
 * it the accent border + a badge. Renderer: `Pricing` in
 * `@indiecrafts/packages-web-ui-components/web/collection`.
 */
export default defineModule({
  name: "module.pricing",
  title: "Tarifs",
  icon: CreditCardIcon,
  description:
    "Un titre suivi d'une rangée de formules (nom, prix, période, liste d'avantages, bouton). Mettez une formule en avant pour lui donner la bordure d'accent et un badge.",
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
      name: "tiers",
      title: "Formules",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "tier",
          fields: [
            defineField({
              name: "name",
              title: "Nom",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "price",
              title: "Prix",
              type: "string",
              description:
                "Le prix tel qu'affiché, ex. « 19 € » ou « Gratuit ».",
            }),
            defineField({
              name: "period",
              title: "Période (optionnel)",
              type: "string",
              description: "Ex. « / mois ». Vide = masqué.",
            }),
            defineField({
              name: "description",
              title: "Description (optionnel)",
              type: "string",
              description: "Une ligne sous le prix, ex. « Par éditeur ».",
            }),
            defineField({
              name: "highlighted",
              title: "Mise en avant",
              type: "boolean",
              description:
                "Ajoute la bordure d'accent + un badge. Une seule formule en général.",
              initialValue: false,
            }),
            defineField({
              name: "badge",
              title: "Badge (optionnel)",
              type: "string",
              description:
                "Petit libellé affiché sur la formule mise en avant, ex. « Populaire ».",
            }),
            defineField({
              name: "features",
              title: "Avantages",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              description: "La liste des avantages inclus, un par ligne.",
            }),
            defineField({
              name: "cta",
              title: "Bouton",
              type: "cta",
              description: "Le bouton d'action de la formule.",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
          },
        }),
      ],
    }),
  ],
});
