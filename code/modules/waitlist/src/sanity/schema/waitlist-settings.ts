import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

/**
 * Waitlist settings (singleton). The code flag `features.waitlist` is the hard
 * on/off; this is the editor-configurable layer — an `enabled` toggle + per-locale
 * form copy. The join **emails** (confirmation + owner alert) live on the shared
 * `emailStrings` singleton (Studio → E-mails). Read via `getWaitlistSettings()`.
 */
export default defineType({
  name: "waitlistSettings",
  title: "Liste d'attente",
  type: "document",
  icon: UsersIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "enabled",
      title: "Activer la liste d'attente",
      type: "boolean",
      initialValue: true,
      description: "Décoche pour masquer le formulaire sans toucher au code.",
    }),
    defineField({ name: "heading", title: "Titre", type: "localeString" }),
    defineField({ name: "description", title: "Description", type: "localeString" }),
    defineField({ name: "nameLabel", title: "Libellé « Nom »", type: "localeString" }),
    defineField({ name: "buttonLabel", title: "Libellé du bouton", type: "localeString" }),
    defineField({ name: "consentLabel", title: "Texte de consentement", type: "localeString" }),
    defineField({ name: "successMessage", title: "Message de succès", type: "localeString" }),
  ],
  preview: { prepare: () => ({ title: "Liste d'attente — réglages" }) },
});
