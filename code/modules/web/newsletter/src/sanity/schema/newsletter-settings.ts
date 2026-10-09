/**
 * Defines the newsletterSettings Sanity singleton schema.
 *
 * @see docs/reference/modules/web/newsletter/src/sanity/schema/newsletter-settings.md
 */
import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

/**
 * Newsletter settings (singleton). The code flag `features.newsletter` is the
 * hard on/off; `enabled` is the live editor switch on top of it: off hides the
 * newsletter and lead-magnet blocks and refuses sign-ups and confirmations. The
 * form copy lives on each block; the emails on the shared `emailStrings`
 * singleton (Studio → E-mails). Read via `getNewsletterSettings()`.
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
      description:
        "Décoche pour masquer les formulaires d'inscription et de document sur tout le site, sans toucher au code. Les inscriptions en attente ne peuvent plus être confirmées.",
    }),
  ],
  preview: { prepare: () => ({ title: "Infolettre — réglages" }) },
});
