import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * Contact message — captured by the `module.contact` block via `/api/contact`
 * (server-only write client). The public form fills every field, so they are all
 * read-only here except `status` (the one thing an editor changes as they work the
 * inbox). Unlike the waitlist there is no dedupe: each submission is its own record.
 */
export default defineType({
  name: "contactMessage",
  title: "Message (contact)",
  type: "document",
  icon: EnvelopeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({ name: "name", title: "Nom", type: "string", readOnly: true }),
    defineField({
      name: "subject",
      title: "Objet",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 6,
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      description:
        "Nouveau = pas encore traité. Traité = une réponse a été envoyée.",
      options: {
        list: [
          { title: "Nouveau", value: "new" },
          { title: "Traité", value: "handled" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      readOnly: true,
      description: "Page où le message a été envoyé (ex. « /contact »).",
    }),
    defineField({
      name: "language",
      title: "Langue",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "consent",
      title: "Consentement",
      type: "boolean",
      readOnly: true,
      description:
        "La personne a coché la case de consentement à l'envoi du message.",
    }),
    defineField({
      name: "consentPolicyVersion",
      title: "Version de la politique acceptée",
      type: "string",
      readOnly: true,
      description:
        "Version de la politique de confidentialité en vigueur au moment de l'envoi (preuve de consentement RGPD).",
    }),
    defineField({
      name: "createdAt",
      title: "Envoyé le",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      email: "email",
      name: "name",
      subject: "subject",
      status: "status",
    },
    prepare: ({ email, name, subject, status }) => ({
      title: subject || name || email,
      subtitle: `${status ?? "new"} · ${name ? `${name} · ` : ""}${email}`,
    }),
  },
  orderings: [
    {
      name: "createdAtDesc",
      title: "Envoi (récents)",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
