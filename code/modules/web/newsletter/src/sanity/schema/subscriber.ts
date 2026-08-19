import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * Newsletter subscriber — captured by the `module.newsletter` block via
 * `/api/newsletter` (server-only write client). Editors don't create these by
 * hand; the "Abonnés" desk lists + manages them. Fields written by the API are
 * read-only in the Studio; `status` is editable (an editor can still mark
 * confirmed/unsubscribed by hand). Double opt-in: a `pending` subscriber holds a
 * one-time `confirmToken`; clicking the confirm link flips it to `confirmed` and
 * clears the token (see `lib/confirm.ts`).
 */
export default defineType({
  name: "subscriber",
  title: "Abonné",
  type: "document",
  icon: EnvelopeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      description:
        "En attente = inscrit, pas encore confirmé. Désabonné = ne plus contacter.",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Confirmé", value: "confirmed" },
          { title: "Désabonné", value: "unsubscribed" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "consent",
      title: "Consentement",
      type: "boolean",
      readOnly: true,
      description:
        "La personne a coché la case de consentement à l'inscription.",
    }),
    defineField({
      name: "consentPolicyVersion",
      title: "Version de la politique acceptée",
      type: "string",
      readOnly: true,
      description:
        "Version de la politique de confidentialité en vigueur au moment de l'inscription (preuve de consentement RGPD). Vide = non enregistrée.",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      readOnly: true,
      description:
        "Page où l'inscription a eu lieu (ex. « /blog/mon-article »).",
    }),
    defineField({
      name: "language",
      title: "Langue",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "tags",
      title: "Étiquettes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "createdAt",
      title: "Inscrit le",
      type: "datetime",
      readOnly: true,
    }),
    // One-time double-opt-in token (set on signup, cleared on confirm). Hidden —
    // it's plumbing, not editor content.
    defineField({
      name: "confirmToken",
      title: "Jeton de confirmation",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", status: "status" },
    prepare: ({ title, status }) => ({ title, subtitle: status }),
  },
  orderings: [
    {
      name: "createdAtDesc",
      title: "Inscription (récents)",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
