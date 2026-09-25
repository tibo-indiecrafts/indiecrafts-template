/**
 * Defines the internal security-alert email's editable Sanity fields.
 *
 * @see docs/reference/packages/web/email/src/sanity/security-alert-group.md
 */
import { defineField, type FieldDefinition } from "sanity";

/**
 * The INTERNAL security-alert email's editable copy — the two prose parts of the alert the
 * API worker sends to the team on a high/critical incident (`code/shared/api/src/security/
 * alert.ts`): the subject prefix and the intro line. The incident details (severity, type,
 * surface, country…) are inserted automatically and are NOT editable.
 *
 * Operator-facing ops copy, English only — NOT localized (unlike the visitor-facing emails).
 * There is deliberately NO on/off toggle: a security alert must never be silenceable from
 * Studio. Empty fields fall back to the worker's hard-coded English; the send always fires.
 * Wired via `emailSanity([...modules, { emailGroups: securityAlertGroups }])`.
 */
export const securityAlertGroups: FieldDefinition[] = [
  defineField({
    name: "securityAlert",
    title: "Sécurité — alerte d'incident (interne)",
    type: "object",
    options: { collapsible: true, collapsed: true },
    description:
      "E-mail interne envoyé à l'équipe lors d'un incident de sécurité. Les détails (gravité, type, pays…) sont ajoutés automatiquement et ne sont pas modifiables. Pas de case d'activation : cet e-mail ne peut pas être désactivé. Champs vides = texte intégré au worker (anglais).",
    fields: [
      defineField({
        name: "subjectPrefix",
        title: "Préfixe de l'objet",
        type: "string",
        description:
          "Placé avant « gravité — type (surface) ». Vide = « [Security] ».",
      }),
      defineField({
        name: "intro",
        title: "Ligne d'introduction",
        type: "string",
        description:
          "La première ligne, au-dessus des détails. Vide = « An app-level security incident was recorded. ».",
      }),
    ],
  }),
];
