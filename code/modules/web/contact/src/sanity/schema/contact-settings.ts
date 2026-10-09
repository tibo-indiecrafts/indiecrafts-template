/**
 * Define the contactSettings singleton holding the enabled toggle and per-locale form copy.
 *
 * @see docs/reference/modules/web/contact/src/sanity/schema/contact-settings.md
 */
import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { seoTranslationsField } from "@indiecrafts/packages-web-schema";

/**
 * Contact settings (singleton). The code flag `features.contact` is the hard
 * on/off; this is the editor-configurable layer — an `enabled` toggle + per-locale
 * form copy for the `/contact` page. The two **emails** (confirmation to the sender
 * + owner alert) live on the shared `emailStrings` singleton (Studio → E-mails).
 * Read via `getContactSettings()`.
 */
export default defineType({
  name: "contactSettings",
  title: "Contact",
  type: "document",
  icon: EnvelopeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "enabled",
      title: "Activer le formulaire de contact",
      type: "boolean",
      initialValue: true,
      description:
        "Décoche pour masquer la page et tous les formulaires de contact du site, sans toucher au code.",
    }),
    defineField({ name: "heading", title: "Titre", type: "localeString" }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeString",
    }),
    defineField({
      name: "emailPlaceholder",
      title: "Texte d'exemple « E-mail »",
      type: "localeString",
      description:
        "Texte grisé dans le champ e-mail, ex. « vous@exemple.com ». Vide = texte par défaut du site.",
    }),
    defineField({
      name: "nameLabel",
      title: "Libellé « Nom »",
      type: "localeString",
    }),
    defineField({
      name: "subjectLabel",
      title: "Libellé « Objet »",
      type: "localeString",
    }),
    defineField({
      name: "messageLabel",
      title: "Libellé « Message »",
      type: "localeString",
    }),
    defineField({
      name: "buttonLabel",
      title: "Libellé du bouton",
      type: "localeString",
    }),
    defineField({
      name: "consentLabel",
      title: "Texte de consentement",
      type: "localeString",
    }),
    defineField({
      name: "successMessage",
      title: "Message de succès",
      type: "localeString",
    }),
    defineField({
      name: "errorMessage",
      title: "Message d'erreur",
      type: "localeString",
      description:
        "Affiché si l'envoi échoue, ex. « Une erreur s'est produite. Merci de réessayer. » Vide = texte par défaut du site.",
    }),
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
    seoTranslationsField(),
  ],
  preview: { prepare: () => ({ title: "Contact — réglages" }) },
});
