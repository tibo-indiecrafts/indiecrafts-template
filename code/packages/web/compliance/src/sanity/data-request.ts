import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";
import {
  DATA_REQUEST_TYPES,
  REQUEST_TYPE_LABELS_FR,
} from "../requests/request-types";

/**
 * Data-subject request — a record of one visitor exercising a GDPR right via the
 * public `/data-request` form (access, effacement, portabilité…). Captured
 * server-side by `submitDataRequest`; the editor works only the `status`. It is
 * a legal record, not editable content — so it is NOT internationalised and the
 * captured fields are read-only in the Studio.
 */
const REQUEST_TYPE_OPTIONS = DATA_REQUEST_TYPES.map((value) => ({
  value,
  title: REQUEST_TYPE_LABELS_FR[value],
}));

export default defineType({
  name: "dataRequest",
  title: "Demande RGPD",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "requestType",
      title: "Type de demande",
      description: "Le droit que la personne souhaite exercer.",
      type: "string",
      options: { list: REQUEST_TYPE_OPTIONS },
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "E-mail du demandeur",
      description:
        "L'adresse à laquelle répondre. Vérifiez l'identité avant d'agir.",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      description:
        "Détail éventuel ajouté par la personne. Vide = aucun détail fourni.",
      type: "text",
      rows: 4,
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Statut",
      description:
        "Où en est le traitement. À traiter sous un mois (délai légal).",
      type: "string",
      options: {
        list: [
          { value: "new", title: "Nouvelle" },
          { value: "in-progress", title: "En cours" },
          { value: "done", title: "Traitée" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "submittedAt",
      title: "Reçue le",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Page d'origine",
      description: "La page depuis laquelle la demande a été envoyée.",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "locale",
      title: "Langue",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "policyVersion",
      title: "Version de la politique",
      description:
        "Version de la politique de confidentialité en vigueur à la réception.",
      type: "string",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      name: "submittedDesc",
      title: "Plus récentes d'abord",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { email: "email", requestType: "requestType", status: "status" },
    prepare: ({ email, requestType, status }) => {
      const type = requestType
        ? REQUEST_TYPE_LABELS_FR[
            requestType as keyof typeof REQUEST_TYPE_LABELS_FR
          ]
        : undefined;
      const statusLabel =
        status === "done"
          ? "Traitée"
          : status === "in-progress"
            ? "En cours"
            : "Nouvelle";
      return {
        title: email ?? "Demande RGPD",
        subtitle: [type, statusLabel].filter(Boolean).join(" · "),
      };
    },
  },
});
