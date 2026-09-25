/**
 * Define the legal re-acceptance banner singleton.
 *
 * @see docs/reference/packages/web/compliance/src/sanity/legal-consent.md
 */

import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons/Documents";

/**
 * Legal re-acceptance — a single, language-independent singleton
 * (`_id: legalConsent`) holding the copy for the "we updated our policies" banner.
 * It is the sibling of `cookieConsent`, for the CONTRACT documents (privacy,
 * terms, terms of sale) rather than cookies.
 *
 * SOLE runtime source (no message fallback) — read by `getLegalAcceptance`
 * (`src/sanity/legal.ts`). The banner re-shows whenever any tracked legal page's
 * "Dernière mise à jour" date changes; those dates are the version, so an editor
 * normally never touches `version` here.
 */
export default defineType({
  name: "legalConsent",
  title: "Mise à jour des documents légaux",
  type: "document",
  icon: DocumentsIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "version",
      title: "Version (optionnel)",
      type: "string",
      description:
        "Laissez vide en général : la date « Dernière mise à jour » de chaque document légal déclenche déjà le bandeau. Renseignez une valeur (ex. « 2 ») pour forcer un nouveau bandeau sans changer les dates.",
    }),
    defineField({
      name: "banner",
      title: "Texte du bandeau",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "message",
          title: "Message",
          type: "localeString",
          description:
            "La phrase affichée dans le bandeau. Ex. « Nous avons mis à jour notre politique de confidentialité et nos conditions. »",
        }),
        defineField({
          name: "reviewLabel",
          title: "Bouton « consulter »",
          type: "localeString",
          description: "Texte du lien vers les documents. Ex. « Consulter ».",
        }),
        defineField({
          name: "acceptLabel",
          title: "Bouton « accepter »",
          type: "localeString",
          description: "Texte du bouton d'acceptation. Ex. « Accepter ».",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Mise à jour des documents légaux" }),
  },
});
