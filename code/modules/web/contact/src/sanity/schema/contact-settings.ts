/**
 * Define the contactSettings singleton holding the enabled toggle and per-locale form copy.
 *
 * @see docs/reference/modules/web/contact/src/sanity/schema/contact-settings.md
 */
import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

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
      description: "Décoche pour masquer le formulaire sans toucher au code.",
    }),
    defineField({ name: "heading", title: "Titre", type: "localeString" }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeString",
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
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
  ],
  preview: { prepare: () => ({ title: "Contact — réglages" }) },
});
