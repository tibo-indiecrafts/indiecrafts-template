import { defineField } from "sanity";
import { StarIcon } from "@sanity/icons";
import { defineModule } from "../objects/define-module";

/**
 * Page hero — the lead band of a marketing page: a small eyebrow, a large
 * title (wrap a word in `[[ ]]` to colour it in the brand accent), a subtitle,
 * and an optional call-to-action button. Renderer: `Hero` in
 * `@indiecrafts/ui-components/web/layout`.
 */
export default defineModule({
  name: "module.hero",
  title: "En-tête (hero)",
  icon: StarIcon,
  description:
    "La grande bande d'introduction en haut d'une page : sur-titre, titre, sous-titre et un bouton optionnel. Entourez un mot du titre de [[ ]] pour l'afficher dans la couleur d'accent.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Sur-titre (optionnel)",
      type: "string",
      description:
        "Petit texte au-dessus du titre. Ex. « Modèle prêt à l'emploi ». Vide = masqué.",
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description:
        "Le grand titre. Entourez un mot de [[ ]] pour l'accentuer, ex. « Livrez [[vite]] ».",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Sous-titre (optionnel)",
      type: "text",
      rows: 2,
      description: "Phrase d'introduction sous le titre. Vide = masqué.",
    }),
    defineField({
      name: "cta",
      title: "Bouton (optionnel)",
      type: "cta",
      description: "Bouton d'action principal. Vide = aucun bouton.",
    }),
  ],
});
