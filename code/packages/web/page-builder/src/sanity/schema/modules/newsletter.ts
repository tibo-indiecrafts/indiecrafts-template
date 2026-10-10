/**
 * Define the newsletter module — an email newsletter capture block.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/newsletter.md
 */
import { BellIcon } from "@sanity/icons/Bell";
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

/**
 * Newsletter capture block. Every string is per-instance + per-locale (the block
 * lives inside a language-tagged doc). Submits to `/api/newsletter`; where the
 * address goes is set by `newsletter.destination` in `@indiecrafts/packages-shared-config`.
 */
export default defineModule({
  name: "module.newsletter",
  title: "Infolettre",
  icon: BellIcon,
  description: "Le formulaire d'inscription à la newsletter.",
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
      name: "buttonLabel",
      title: "Texte du bouton",
      type: "string",
      initialValue: "S'inscrire",
    }),
    defineField({
      name: "consentText",
      title: "Texte de consentement",
      type: "text",
      rows: 2,
      description: "La case que la personne coche avant de s'inscrire (RGPD).",
      initialValue:
        "J'accepte de recevoir l'infolettre et que mon adresse e-mail soit conservée à cette fin.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Message après inscription",
      type: "string",
      initialValue:
        "Presque terminé — vérifiez votre boîte mail pour confirmer votre inscription.",
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
      title: heading || "Infolettre",
      subtitle: `Infolettre (${variant ?? "card"})`,
    }),
  },
});
