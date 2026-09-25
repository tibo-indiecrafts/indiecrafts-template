/**
 * Define the waitlistEntry document — a captured or hand-added early-access signup.
 *
 * @see docs/reference/modules/web/waitlist/src/sanity/schema/waitlist-entry.md
 */
import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

/**
 * Waitlist entry — captured by the `module.waitlist` block via `/api/waitlist`
 * (server-only write client) **or added by hand** by an editor in the "Liste
 * d'attente" desk. So `email` + `name` + `status` are editable; the fields the API
 * fills (source / language / consent / createdAt) are read-only.
 */
export default defineType({
  name: "waitlistEntry",
  title: "Inscrit·e (liste d'attente)",
  type: "document",
  icon: UsersIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({ name: "name", title: "Nom", type: "string" }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      description: "En attente = pas encore contacté. Invité = accès envoyé.",
      options: {
        list: [
          { title: "En attente", value: "waiting" },
          { title: "Invité·e", value: "invited" },
        ],
        layout: "radio",
      },
      initialValue: "waiting",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      readOnly: true,
      description:
        "Page où l'inscription a eu lieu (ex. « /lancement »). Vide = ajouté à la main.",
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
        "La personne a coché la case de consentement à l'inscription.",
    }),
    defineField({
      name: "consentPolicyVersion",
      title: "Version de la politique acceptée",
      type: "string",
      readOnly: true,
      description:
        "Version de la politique de confidentialité en vigueur au moment de l'inscription (preuve de consentement RGPD). Vide = ajouté à la main.",
    }),
    defineField({
      name: "createdAt",
      title: "Inscrit·e le",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", name: "name", status: "status" },
    prepare: ({ title, name, status }) => ({
      title: name || title,
      subtitle: `${status ?? "waiting"}${name ? ` · ${title}` : ""}`,
    }),
  },
  orderings: [
    {
      name: "createdAtDesc",
      title: "Inscription (récents)",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
