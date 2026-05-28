import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";
import { MODULE_TYPES } from "../modules";

const moduleFieldRefs = MODULE_TYPES.map((type) => ({ type }));

/**
 * Blog singleton — owns the layout of the /blog index AND the per-post
 * page. Two `modules: []` arrays compose them; when empty, the routes
 * fall back to a hard-coded default grid / article layout.
 *
 * Editors only ever have ONE of these. Studio singleton wiring lives in
 * `src/sanity/structure.ts`.
 */
export default defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  icon: BlockContentIcon,
  // Block "+ Create" + global search/list surfaces — the singleton has
  // exactly one instance with `documentId: "blog"`, edited from the
  // sidebar entry in `structure.ts`. Without this an editor could
  // accidentally produce a second doc via search → 404 in `[0]` GROQ.
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "frontpageModules",
      title: "Modules de la page d'accueil du blog",
      description:
        "Compose la page /blog. Vide = grille de cartes par défaut. Ajoutez un module « Blog post list » pour afficher les articles.",
      type: "array",
      of: moduleFieldRefs,
    }),
    defineField({
      name: "postModules",
      title: "Modules par article",
      description:
        "Compose la mise en page de chaque /blog/[slug]. Vide = mise en page article par défaut. Incluez un module « Blog post content » pour afficher le corps de l'article actif.",
      type: "array",
      of: moduleFieldRefs,
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Blog",
      subtitle: "Mise en page accueil + article",
    }),
  },
});
