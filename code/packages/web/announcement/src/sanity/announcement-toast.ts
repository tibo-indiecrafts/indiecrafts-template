import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";
import { surfacesField } from "./surfaces";

/**
 * Announcement toast — a single, language-independent singleton (`_id:
 * announcementToast`) that drives a richer, corner announcement than the bar: a
 * title + body, an OPTIONAL image, and an optional link. Targeted per surface
 * (`surfaces`) and shown "live now" from the enable toggle + date window.
 *
 * SOLE runtime source — resolved by `resolveToast` (`@indiecrafts/packages-shared-announcement`),
 * read server-side on the web surfaces and served to mobile by the
 * `code/shared/api` Worker. `announcementLink` is the same link object the bar uses
 * (registered once in `index.ts`).
 */
export default defineType({
  name: "announcementToast",
  title: "Toast d'annonce",
  type: "document",
  icon: CommentIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "enabled",
      title: "Activer le toast",
      type: "boolean",
      initialValue: false,
      description: "Décochez pour masquer le toast sans toucher au code.",
    }),
    surfacesField,
    defineField({
      name: "title",
      title: "Titre",
      type: "localeString",
      description: "Le titre du toast. Ex. « Nouvelle fonctionnalité ».",
    }),
    defineField({
      name: "body",
      title: "Message",
      type: "localeText",
      description:
        "Une ou deux phrases sous le titre. Ex. « Essayez notre nouvel espace membre ».",
    }),
    defineField({
      name: "image",
      title: "Image (optionnelle)",
      type: "image",
      options: { hotspot: true },
      description:
        "Petite illustration affichée à côté du texte. Vide = toast sans image.",
    }),
    defineField({
      name: "imageAlt",
      title: "Texte alternatif de l'image",
      type: "localeString",
      description:
        "Décrit l'image pour les lecteurs d'écran. Vide = image décorative (ignorée).",
    }),
    defineField({ name: "link", title: "Lien", type: "announcementLink" }),
    defineField({
      name: "autoDismissSeconds",
      title: "Disparaît après (secondes)",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
      description:
        "Combien de secondes avant que le toast se ferme seul. Vide = il reste jusqu'à ce que le visiteur le ferme (recommandé si vous mettez un lien).",
    }),
    defineField({
      name: "start",
      title: "Afficher à partir du",
      type: "datetime",
      description:
        "Le toast n'apparaît qu'après cette date. Vide = tout de suite.",
    }),
    defineField({
      name: "end",
      title: "Masquer après le",
      type: "datetime",
      description: "Le toast disparaît après cette date. Vide = pas de fin.",
    }),
  ],
  preview: {
    select: { enabled: "enabled", title: "title", media: "image" },
    prepare: ({ enabled, title, media }) => ({
      title: "Toast d'annonce",
      subtitle: `${enabled ? "Activé" : "Désactivé"} · ${(title?.fr || title?.en || "sans titre") as string}`,
      media,
    }),
  },
});
