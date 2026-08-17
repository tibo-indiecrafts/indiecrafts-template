import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

/**
 * Public blog comment (user-generated). Created server-side via the write
 * client with `approved: false` — it only appears on the site once an editor
 * ticks **Approuvé**. `authorEmail` is stored for moderation but **never**
 * projected to the public site. Moderated from the "Commentaires" desk section
 * (`sanity/structure.ts`); the visitor form + its copy live in the `blog`
 * singleton's `comments` object.
 */
export default defineType({
  name: "comment",
  title: "Commentaire",
  type: "document",
  icon: CommentIcon,
  // Created via the /api/comments route, not the Studio — keep it out of the
  // global "+ Create" + search surfaces.
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "approved",
      title: "Approuvé",
      type: "boolean",
      initialValue: false,
      description:
        "Un commentaire n'apparaît sur le site qu'une fois coché. Décochez pour le retirer.",
    }),
    defineField({
      name: "authorName",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "authorEmail",
      title: "E-mail (privé)",
      type: "string",
      description:
        "Jamais affiché sur le site — sert uniquement à la modération. Vide = autorisé.",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "body",
      title: "Commentaire",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(2000),
    }),
    defineField({
      name: "post",
      title: "Article",
      type: "reference",
      to: [{ type: "post" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parent",
      title: "En réponse à",
      type: "reference",
      to: [{ type: "comment" }],
      readOnly: true,
      description: "Réponse à un autre commentaire. Vide = commentaire de premier niveau.",
    }),
    defineField({
      name: "createdAt",
      title: "Reçu le",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "consent",
      title: "Consentement",
      type: "boolean",
      readOnly: true,
      description: "La personne a accepté le stockage de son nom + commentaire.",
    }),
    defineField({
      name: "consentPolicyVersion",
      title: "Version de la politique acceptée",
      type: "string",
      readOnly: true,
      description:
        "Version de la politique de confidentialité en vigueur au moment du commentaire (preuve de consentement RGPD). Vide = non enregistrée.",
    }),
    defineField({
      name: "spam",
      title: "Spam",
      type: "boolean",
      initialValue: false,
      description: "Marquez un commentaire indésirable (il reste masqué du site).",
    }),
    // One-time token for the email moderation buttons (approve / spam / delete);
    // set on create, cleared on the first action. Hidden — it's plumbing.
    defineField({
      name: "moderationToken",
      title: "Jeton de modération",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [
    { name: "newest", title: "Plus récents", by: [{ field: "createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { name: "authorName", body: "body", approved: "approved", post: "post.title" },
    prepare({ name, body, approved, post }) {
      return {
        title: `${name ?? "?"}${approved ? "" : " · en attente"}`,
        subtitle: [post, (body ?? "").slice(0, 60)].filter(Boolean).join(" — "),
      };
    },
  },
});
