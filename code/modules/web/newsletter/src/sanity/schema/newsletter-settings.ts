import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * Newsletter settings (singleton). The code flag `features.newsletter` is the
 * hard on/off; this is the editor-configurable layer — an `enabled` toggle +
 * per-locale **form** copy. The subscribe **emails** (double opt-in + owner
 * alert) live in the shared `emailStrings` singleton (Studio → E-mails), owned by
 * `@indiecrafts/packages-web-email`. Read via `getNewsletterSettings()`.
 */
export default defineType({
  name: "newsletterSettings",
  title: "Infolettre",
  type: "document",
  icon: EnvelopeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "enabled",
      title: "Activer l'infolettre",
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
  ],
  preview: { prepare: () => ({ title: "Infolettre — réglages" }) },
});
