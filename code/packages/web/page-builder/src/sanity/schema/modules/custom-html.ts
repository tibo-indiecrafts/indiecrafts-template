/**
 * Define the custom-html module — a raw HTML escape hatch for trusted editors.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/custom-html.md
 */
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.custom-html",
  title: "HTML personnalisé",
  fields: [
    defineField({
      name: "html",
      title: "HTML",
      type: "text",
      rows: 12,
      description:
        "⚠️ Source de confiance uniquement. Rendu via dangerouslySetInnerHTML — tout HTML, balise <script> ou widget tiers collé ici s'exécute dans le navigateur des visiteurs avec les mêmes privilèges que le reste du site. Ne collez jamais du balisage provenant de sources que vous ne contrôlez pas, et restreignez les rôles Sanity Studio pour que seuls les éditeurs de confiance puissent modifier ce champ.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "width",
      title: "Largeur",
      type: "string",
      description:
        "« Contenue » = même largeur que les autres blocs (recommandé, avec des marges). « Pleine largeur » = occupe toute la largeur de l'écran (utile pour une bannière ou un formulaire qui doit s'étendre). Vide = contenue.",
      options: {
        list: [
          { title: "Contenue", value: "contained" },
          { title: "Pleine largeur", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "contained",
    }),
  ],
  preview: { prepare: () => ({ title: "HTML personnalisé" }) },
});
