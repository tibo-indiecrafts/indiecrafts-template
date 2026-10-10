/**
 * Define the lead-magnet module — email capture tied to a downloadable resource.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/lead-magnet.md
 */
import { DownloadIcon } from "@sanity/icons/Download";
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

/**
 * Lead-magnet capture block. Same email + consent capture as the newsletter,
 * tied to a downloadable resource (`leadMagnet` reference) that the person
 * receives after confirming their e-mail. Every string is per-instance +
 * per-locale (the block lives inside a language-tagged doc). Submits to
 * `/api/newsletter` with `source: "lead-magnet"` + the magnet id as a tag; the
 * `magnet` reference is dereferenced to its `id` in `MODULES_FRAGMENT`.
 */
export default defineModule({
  name: "module.lead-magnet",
  title: "Aimant à prospects",
  icon: DownloadIcon,
  description:
    "Un contenu à télécharger contre une inscription à la newsletter.",
  fields: [
    defineField({
      name: "magnet",
      title: "Ressource à envoyer",
      type: "reference",
      to: [{ type: "leadMagnet" }],
      validation: (Rule) => Rule.required(),
      description:
        "Le document téléchargeable envoyé après confirmation de l'e-mail.",
    }),
    defineField({
      name: "heading",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Texte d'accroche",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "emailPlaceholder",
      title: "Exemple dans le champ e-mail",
      type: "string",
      initialValue: "vous@exemple.com",
    }),
    defineField({
      name: "buttonLabel",
      title: "Texte du bouton",
      type: "string",
      initialValue: "Recevoir le document",
    }),
    defineField({
      name: "consentText",
      title: "Texte de consentement",
      type: "text",
      rows: 2,
      description: "La case que la personne coche avant de s'inscrire (RGPD).",
      initialValue:
        "J'accepte de recevoir ce document et que mon adresse e-mail soit conservée à cette fin.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Message après inscription",
      type: "string",
      initialValue:
        "Presque terminé — confirmez depuis votre boîte mail et nous vous envoyons le document.",
    }),
    defineField({
      name: "errorMessage",
      title: "Message d'erreur",
      type: "string",
      initialValue: "Une erreur s'est produite. Merci de réessayer.",
    }),
    defineField({
      name: "variant",
      title: "Disposition",
      type: "string",
      options: {
        list: [
          { title: "Carte", value: "card" },
          { title: "En ligne (une ligne)", value: "inline" },
          { title: "Bandeau pleine largeur", value: "banner" },
        ],
        layout: "radio",
      },
      initialValue: "card",
    }),
  ],
  preview: {
    select: { heading: "heading", variant: "variant" },
    prepare: ({ heading, variant }) => ({
      title: heading || "Aimant à prospects",
      subtitle: `Aimant à prospects (${variant ?? "card"})`,
    }),
  },
});
