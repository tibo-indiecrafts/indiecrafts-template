/**
 * Define the subscriber email-preference-centre singleton.
 *
 * @see docs/reference/packages/web/email/src/sanity/email-preferences.md
 */

import { defineArrayMember, defineField, defineType } from "sanity";
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defaultLocale } from "@indiecrafts/packages-shared-config";

/**
 * One marketing preference category shown in the subscriber preference centre
 * (e.g. "News", "Offers"). `key` is the stable identifier code reads (matched
 * against `resendTopicId` and the unsubscribe/preferences link) — once a
 * category is saved, `key` locks (`readOnly`) so it can never drift under a
 * live subscriber list.
 */
const emailPreferenceCategory = defineArrayMember({
  type: "object",
  name: "emailPreferenceCategory",
  title: "Catégorie de préférence",
  fields: [
    defineField({
      name: "key",
      title: "Identifiant",
      type: "string",
      description:
        "Le code interne de cette catégorie (ex. « news »). Ne peut plus être changé une fois enregistré.",
      readOnly: ({ value }) => Boolean(value),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "localeString",
      description:
        "Le nom de la catégorie affiché à l'abonné dans son centre de préférences. Une ligne par langue.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      description:
        "Explique à l'abonné ce qu'il recevra en activant cette catégorie. Une ligne par langue.",
    }),
    defineField({
      name: "includeAtSignup",
      title: "Cochée par défaut à l'inscription",
      type: "boolean",
      initialValue: false,
      description:
        "Activé = la case est déjà cochée dans le formulaire d'inscription. Désactivé = l'abonné doit l'activer lui-même.",
    }),
    defineField({
      name: "resendTopicId",
      title: "Identifiant de topic Resend",
      type: "string",
      description:
        "L'identifiant du topic Resend lié à cette catégorie. Vide = aucune synchronisation.",
    }),
  ],
  preview: {
    select: { name: `name.${defaultLocale}`, key: "key" },
    prepare: ({ name, key }: { name?: string; key?: string }) => ({
      title: name || key,
      subtitle: key,
    }),
  },
});

/**
 * A display-only notice in the preference centre (e.g. "You'll always receive
 * order confirmations") — informational, not a toggle: no `key`,
 * `includeAtSignup`, or `resendTopicId`.
 */
const emailPreferenceNotice = defineArrayMember({
  type: "object",
  name: "emailPreferenceNotice",
  title: "Mention informative",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "localeString",
      description: "Le titre de la mention. Une ligne par langue.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      description: "Le texte de la mention. Une ligne par langue.",
    }),
  ],
  preview: {
    select: { name: `name.${defaultLocale}` },
    prepare: ({ name }: { name?: string }) => ({ title: name || "Mention" }),
  },
});

const seededCategory = (
  key: string,
  name: { en: string; fr: string },
  description: { en: string; fr: string },
  includeAtSignup = false,
) => ({ key, name, description, includeAtSignup, resendTopicId: "" });

/**
 * Préférences e-mail (singleton) — the subscriber-facing preference centre:
 * the marketing categories an abonné can toggle (`categories[]`, seeded with
 * the 4 reserved keys below) plus display-only transactional notices
 * (`notices[]`, e.g. "you'll always get order confirmations"), plus the
 * `churned` win-back topic a departing contact is switched to in place of
 * every other category. Read by the preference-centre page + the
 * unsubscribe flow (later task) + the account-deletion path.
 */
export const emailPreferencesSchema = defineType({
  name: "emailPreferences",
  title: "Préférences e-mail",
  type: "document",
  icon: EnvelopeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "categories",
      title: "Catégories",
      type: "array",
      of: [emailPreferenceCategory],
      description:
        "Les catégories que l'abonné peut activer ou désactiver. L'identifiant de chacune est fixé à la création.",
    }),
    defineField({
      name: "notices",
      title: "Mentions informatives",
      type: "array",
      of: [emailPreferenceNotice],
      description:
        "Les e-mails transactionnels (ex. confirmations de commande) que l'abonné reçoit toujours, listés à titre informatif.",
    }),
    defineField({
      name: "churned",
      title: "Topic de reconquête (comptes résiliés)",
      type: "object",
      description:
        "Le topic Resend auquel un contact est basculé quand son compte est supprimé, à la place de toutes les autres catégories.",
      fields: [
        defineField({
          name: "name",
          title: "Nom",
          type: "localeString",
          description: "Le nom du topic. Une ligne par langue.",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "localeText",
          description: "Description interne du topic. Une ligne par langue.",
        }),
        defineField({
          name: "resendTopicId",
          title: "Identifiant de topic Resend",
          type: "string",
          description:
            "L'identifiant du topic Resend lié à la reconquête. Vide = aucune synchronisation.",
        }),
      ],
    }),
  ],
  initialValue: {
    churned: {
      name: {
        en: "Win-back (former members)",
        fr: "Reconquête (anciens membres)",
      },
    },
    categories: [
      seededCategory(
        "news",
        { en: "News", fr: "Actualités" },
        {
          en: "Product updates and company news.",
          fr: "Nouveautés produit et actualités de l'entreprise.",
        },
        true,
      ),
      seededCategory(
        "offers",
        { en: "Offers", fr: "Offres" },
        {
          en: "Discounts and promotions.",
          fr: "Réductions et promotions.",
        },
      ),
      seededCategory(
        "partners",
        { en: "Partners", fr: "Partenaires" },
        {
          en: "Communications from our third-party partners.",
          fr: "Communications de nos partenaires tiers.",
        },
      ),
      seededCategory(
        "tips",
        { en: "Tips", fr: "Conseils" },
        {
          en: "Tips and best practices.",
          fr: "Conseils et bonnes pratiques.",
        },
      ),
    ],
    // The transactional emails the site sends today, so the read-only section shows.
    notices: [
      {
        name: { en: "Sign-in and security", fr: "Connexion et sécurité" },
        description: {
          en: "Sign-in codes and security alerts.",
          fr: "Codes de connexion et alertes de sécurité.",
        },
      },
      {
        name: {
          en: "Your account and data",
          fr: "Votre compte et vos données",
        },
        description: {
          en: "Welcome, data export and account deletion emails.",
          fr: "E-mails de bienvenue, d'export de données et de suppression de compte.",
        },
      },
    ],
  },
  preview: {
    prepare: () => ({
      title: "Préférences e-mail",
      subtitle: "Catégories et mentions du centre de préférences",
    }),
  },
});

/** "Préférences e-mail" desk item — the editable `emailPreferences` singleton. */
export function emailPreferencesStructureItem(
  S: StructureBuilder,
): ListItemBuilder {
  return S.listItem()
    .title("Préférences e-mail")
    .icon(EnvelopeIcon)
    .child(
      S.editor()
        .id("emailPreferences")
        .schemaType("emailPreferences")
        .documentId("emailPreferences"),
    );
}
