import { defineField, defineType } from "sanity";
import { DownloadIcon } from "@sanity/icons";

/**
 * Lead magnet — a downloadable file (guide, checklist, template) offered in
 * exchange for an e-mail. A `module.lead-magnet` capture block references one of
 * these; after the visitor confirms their e-mail (double opt-in), the file is
 * delivered as a signed, expiring link (`lib/deliver-magnet.ts` +
 * `@indiecrafts/gated-delivery`). Editors create + manage these in the "Aimants
 * à prospects" desk.
 */
export default defineType({
  name: "leadMagnet",
  title: "Aimant à prospects",
  type: "document",
  icon: DownloadIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nom du document",
      type: "string",
      description:
        "Le nom affiché dans l'e-mail de livraison. Ex. « Guide de démarrage (PDF) ».",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "asset",
      title: "Fichier à télécharger",
      type: "file",
      description:
        "Le document envoyé après confirmation de l'e-mail (PDF, ZIP, etc.).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Actif",
      type: "boolean",
      description:
        "Décochez pour suspendre la livraison sans supprimer le document.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({
      title: title || "Aimant à prospects",
      subtitle: enabled === false ? "Inactif" : "Actif",
    }),
  },
});
