import { defineField, defineType } from "sanity";
import { defaultLocale } from "@indiecrafts/packages-shared-config";

/**
 * One consent category shown in the cookie banner / preferences dialog. `required`
 * categories (necessary) are always on and can't be toggled off. `consentSignals`
 * maps this category to Google Consent Mode keys — accepting the category flips
 * those signals to `granted` (resolved in `getCookieConsent`, pushed by the banner).
 */
const CONSENT_SIGNALS = [
  {
    title: "Mesure d'audience (analytics_storage)",
    value: "analytics_storage",
  },
  { title: "Publicité — stockage (ad_storage)", value: "ad_storage" },
  {
    title: "Publicité — données utilisateur (ad_user_data)",
    value: "ad_user_data",
  },
  {
    title: "Publicité — personnalisation (ad_personalization)",
    value: "ad_personalization",
  },
  {
    title: "Fonctionnalités (functionality_storage)",
    value: "functionality_storage",
  },
  {
    title: "Personnalisation (personalization_storage)",
    value: "personalization_storage",
  },
  { title: "Sécurité (security_storage)", value: "security_storage" },
];

const CATEGORY_KEYS = [
  { title: "Nécessaires", value: "necessary" },
  { title: "Mesure d'audience", value: "analytics" },
  { title: "Marketing / publicité", value: "marketing" },
  { title: "Préférences", value: "preferences" },
];

export default defineType({
  name: "cookieCategory",
  title: "Catégorie de cookies",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Type",
      type: "string",
      description: "La catégorie. Ne pas changer après création.",
      options: { list: CATEGORY_KEYS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Nom affiché",
      type: "localeString",
      description:
        "Le nom lu par le visiteur, ex. « Mesure d'audience ». Une ligne par langue.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeString",
      description:
        "Courte explication de ce que fait cette catégorie. Une ligne par langue.",
    }),
    defineField({
      name: "required",
      title: "Toujours active (obligatoire)",
      type: "boolean",
      description:
        "Activé pour les cookies nécessaires au fonctionnement du site — le visiteur ne peut pas les refuser.",
      initialValue: false,
    }),
    defineField({
      name: "consentSignals",
      title: "Signaux Google Consent Mode",
      type: "array",
      of: [{ type: "string" }],
      options: { list: CONSENT_SIGNALS },
      description:
        "Ce que l'acceptation de cette catégorie autorise côté Google. Laissez vide pour la catégorie « Nécessaires ».",
    }),
  ],
  preview: {
    select: {
      title: `title.${defaultLocale}`,
      key: "key",
      required: "required",
    },
    prepare: ({ title, key, required }) => ({
      title: title || key,
      subtitle: required ? "Obligatoire" : "Optionnelle",
    }),
  },
});
