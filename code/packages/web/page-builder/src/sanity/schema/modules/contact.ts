/**
 * Define the contact module — a localized contact form block.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/contact.md
 */
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

/**
 * Contact form block. Every string is per-instance + per-locale (the block lives
 * inside a language-tagged doc). Submits to `/api/contact` → a `contactMessage`
 * doc. No refs/image, so it passes straight through `MODULES_FRAGMENT`.
 */
export default defineModule({
  name: "module.contact",
  title: "Formulaire de contact",
  icon: EnvelopeIcon,
  description: "Le formulaire de contact.",
  fields: [
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
      name: "namePlaceholder",
      title: "Exemple dans le champ nom",
      type: "string",
      description: "Vide = pas de champ « nom ».",
      initialValue: "Votre nom",
    }),
    defineField({
      name: "subjectPlaceholder",
      title: "Exemple dans le champ objet",
      type: "string",
      description: "Vide = pas de champ « objet ».",
    }),
    defineField({
      name: "messagePlaceholder",
      title: "Exemple dans le champ message",
      type: "string",
      initialValue: "Votre message…",
    }),
    defineField({
      name: "buttonLabel",
      title: "Texte du bouton",
      type: "string",
      initialValue: "Envoyer",
    }),
    defineField({
      name: "consentText",
      title: "Texte de consentement",
      type: "text",
      rows: 2,
      description: "La case que la personne coche avant d'envoyer (RGPD).",
      initialValue:
        "J'accepte que mon message et mon adresse e-mail soient utilisés pour me répondre.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Message après envoi",
      type: "string",
      initialValue:
        "Merci — votre message est bien parti. Nous vous répondrons vite.",
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
      title: heading || "Formulaire de contact",
      subtitle: `Contact (${variant ?? "card"})`,
    }),
  },
});
