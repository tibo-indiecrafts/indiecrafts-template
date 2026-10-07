/**
 * Defines the waitlist page-builder module — an email capture block with GDPR consent.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/waitlist.md
 */
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

/**
 * Waitlist capture block. Every string is per-instance + per-locale (the block
 * lives inside a language-tagged doc). Submits to `/api/waitlist` → a
 * `waitlistEntry` doc. No refs/image, so it passes straight through
 * `MODULES_FRAGMENT`.
 */
export default defineModule({
  name: "module.waitlist",
  title: "Liste d'attente",
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
      description: "Vide = pas de champ « nom » (e-mail seul).",
    }),
    defineField({
      name: "buttonLabel",
      title: "Texte du bouton",
      type: "string",
      initialValue: "Rejoindre la liste",
    }),
    defineField({
      name: "consentText",
      title: "Texte de consentement",
      type: "text",
      rows: 2,
      description: "La case que la personne coche avant de s'inscrire (RGPD).",
      initialValue:
        "J'accepte d'être contacté·e au sujet de l'accès anticipé et que mon adresse e-mail soit conservée à cette fin.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Message après inscription",
      type: "string",
      initialValue:
        "Vous êtes sur la liste — merci ! Nous vous tiendrons au courant.",
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
      title: heading || "Liste d'attente",
      subtitle: `Liste d'attente (${variant ?? "card"})`,
    }),
  },
});
