import { defineField, defineType } from "sanity";
import { BellIcon } from "@sanity/icons";

/**
 * Announcement bar — a single, language-independent singleton (`_id:
 * announcementBar`) that drives the strip under the site navigation. Holds an
 * array of small announcements (each with per-locale text, an optional copyable
 * discount code, and an optional link); the bar shows or rotates the ones that
 * are live now.
 *
 * SOLE runtime source (no config fallback) — read by `getAnnouncement`
 * (`src/sanity/announcement.ts`), which computes "live now" from the enable
 * toggle + the date windows and localizes the copy.
 */

/** One announcement link — an internal path or an external URL. */
export const announcementLink = defineType({
  name: "announcementLink",
  title: "Lien",
  type: "object",
  fields: [
    defineField({
      name: "linkType",
      title: "Type de lien",
      type: "string",
      options: {
        list: [
          { title: "Page du site", value: "internal" },
          { title: "Adresse externe", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "href",
      title: "Adresse",
      type: "string",
      description:
        "Un chemin interne (ex. « /boutique ») ou une adresse complète (ex. « https://exemple.com »).",
    }),
    defineField({
      name: "newTab",
      title: "Ouvrir dans un nouvel onglet",
      type: "boolean",
      initialValue: false,
      description: "Pour une adresse externe. Vide = même onglet.",
    }),
    defineField({
      name: "label",
      title: "Texte du lien",
      type: "localeString",
      description: "Ex. « J'en profite ». Vide = tout le message devient cliquable.",
    }),
  ],
});

/** One announcement — text + optional discount code + optional link + window. */
export const announcementItem = defineType({
  name: "announcementItem",
  title: "Annonce",
  type: "object",
  fields: [
    defineField({
      name: "message",
      title: "Message",
      type: "localeString",
      description: "Le texte de l'annonce. Ex. « -30% ce week-end avec le code SOLDES30 ».",
    }),
    defineField({
      name: "discountCode",
      title: "Code promo",
      type: "string",
      description:
        "Code mis en évidence, cliquable pour le copier. Ex. « SOLDES30 ». Vide = aucun code.",
    }),
    defineField({ name: "link", title: "Lien", type: "announcementLink" }),
    defineField({
      name: "start",
      title: "Afficher à partir du",
      type: "datetime",
      description: "Cette annonce n'apparaît qu'après cette date. Vide = tout de suite.",
    }),
    defineField({
      name: "end",
      title: "Masquer après le",
      type: "datetime",
      description: "Cette annonce disparaît après cette date. Vide = pas de fin.",
    }),
  ],
  preview: {
    select: { message: "message", code: "discountCode" },
    prepare: ({ message, code }) => ({
      title: (message?.fr || message?.en || "Annonce") as string,
      subtitle: code ? `Code : ${code}` : undefined,
    }),
  },
});

export default defineType({
  name: "announcementBar",
  title: "Bandeau d'annonce",
  type: "document",
  icon: BellIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "enabled",
      title: "Activer le bandeau",
      type: "boolean",
      initialValue: false,
      description: "Décochez pour masquer le bandeau sans toucher au code.",
    }),
    defineField({
      name: "dismissible",
      title: "Le visiteur peut fermer le bandeau",
      type: "boolean",
      initialValue: true,
      description:
        "Ajoute un bouton × . Décochez pour un bandeau permanent. Vide = fermable.",
    }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Marque (couleur d'accent)", value: "brand" },
          { title: "Discret (fond neutre)", value: "neutral" },
          { title: "Contraste (fond foncé)", value: "contrast" },
        ],
        layout: "radio",
      },
      initialValue: "brand",
    }),
    defineField({
      name: "start",
      title: "Afficher à partir du",
      type: "datetime",
      description: "Le bandeau n'apparaît qu'après cette date. Vide = tout de suite.",
    }),
    defineField({
      name: "end",
      title: "Masquer après le",
      type: "datetime",
      description: "Le bandeau disparaît après cette date. Vide = pas de fin.",
    }),
    defineField({
      name: "items",
      title: "Annonces",
      type: "array",
      of: [{ type: "announcementItem" }],
      description: "Une ou plusieurs annonces. Plusieurs = elles défilent à tour de rôle.",
    }),
  ],
  preview: {
    select: { enabled: "enabled", items: "items" },
    prepare: ({ enabled, items }) => ({
      title: "Bandeau d'annonce",
      subtitle: `${enabled ? "Activé" : "Désactivé"} · ${items?.length ?? 0} annonce(s)`,
    }),
  },
});
