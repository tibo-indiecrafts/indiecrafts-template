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
  ],
  preview: { prepare: () => ({ title: "HTML personnalisé" }) },
});
