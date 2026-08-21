import { defineField, type FieldDefinition } from "sanity";

/**
 * Generic factories for the `emailStrings` groups. Each transactional email is
 * an **object field** on the one E-mails singleton; a module contributes its
 * group(s) with these helpers and wires them via `SanityModule.emailGroups`, so
 * the brick never names a module. Two shapes cover every email today:
 *
 * - `confirmationGroup` — a **subscriber-facing** email whose copy is translated
 *   (`localeString`/`localeText`): a `from`, `reply-to`, an admin **BCC**, and the
 *   translated subject/heading/intro/(button)/outro.
 * - `ownerAlertGroup` — an **internal** alert to the site team: recipients
 *   (to/cc/bcc), a `from`, a plain (untranslated) subject, and optional extras
 *   (reply-to, moderation buttons).
 */

const emailArray = (
  name: string,
  title: string,
  description?: string,
): FieldDefinition =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [{ type: "string", validation: (Rule) => Rule.email() }],
    options: { layout: "tags" },
  });

const enabled = (description: string): FieldDefinition =>
  defineField({
    name: "enabled",
    title: "Activer",
    type: "boolean",
    initialValue: false,
    description,
  });

const fromField: FieldDefinition = defineField({
  name: "from",
  title: "Expéditeur (From)",
  description:
    "Doit appartenir à un domaine vérifié dans Resend — ex. bonjour@votre-domaine.com.",
  type: "string",
  validation: (Rule) => Rule.email(),
});

const replyToField = (description: string): FieldDefinition =>
  defineField({
    name: "replyTo",
    title: "Répondre à (Reply-To)",
    type: "string",
    description,
    validation: (Rule) => Rule.email(),
  });

/** A subscriber-facing confirmation email — translated copy + an optional admin BCC. */
export function confirmationGroup(opts: {
  name: string;
  title: string;
  description: string;
  /** Legend for the on/off toggle (says what "off" does for this email). */
  enabledHint: string;
  /** Legend for the translated subject (template hints + "empty = default"). */
  subjectHint: string;
  /** Legend for the translated intro paragraph(s). */
  introHint: string;
  /** Legend for the translated closing line. */
  outroHint: string;
  /** Add a translated action-button label (a confirm/CTA email, e.g. double opt-in). */
  button?: boolean;
}): FieldDefinition {
  return defineField({
    name: opts.name,
    title: opts.title,
    description: opts.description,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      enabled(opts.enabledHint),
      fromField,
      replyToField("Vide = les réponses vont à l'expéditeur ci-dessus."),
      emailArray(
        "bcc",
        "Copie cachée (BCC)",
        "Reçoit une copie invisible de chaque envoi — ex. pour vous vérifier vous-même.",
      ),
      defineField({
        name: "subject",
        title: "Objet",
        description: opts.subjectHint,
        type: "localeString",
      }),
      defineField({
        name: "heading",
        title: "Titre de l'e-mail",
        type: "localeString",
      }),
      defineField({
        name: "intro",
        title: "Texte d'introduction",
        description: opts.introHint,
        type: "localeText",
      }),
      ...(opts.button
        ? [
            defineField({
              name: "buttonLabel",
              title: "Libellé du bouton",
              type: "localeString",
            }),
          ]
        : []),
      defineField({
        name: "outro",
        title: "Texte de fin",
        description: opts.outroHint,
        type: "localeText",
      }),
    ],
  });
}

/** An internal alert to the site team — recipients + a plain (untranslated) subject. */
export function ownerAlertGroup(opts: {
  name: string;
  title: string;
  description: string;
  /** Legend for the on/off toggle. */
  enabledHint: string;
  /** Legend for the "To" recipients field. */
  toHint: string;
  /** Legend for the plain subject (template hints + "empty = default"). */
  subjectHint: string;
  /** Legend for the translated heading — else a generic default. */
  headingHint?: string;
  /** Legend for the translated intro/body — else a generic default. */
  introHint?: string;
  /** Legend for the translated closing line — else a generic default. */
  outroHint?: string;
  /** If set, add a reply-to with this legend (e.g. the comment author's address). */
  replyToHint?: string;
  /** If true, add the in-email moderation-buttons toggle (comments). */
  moderationButtons?: boolean;
}): FieldDefinition {
  return defineField({
    name: opts.name,
    title: opts.title,
    description: opts.description,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      enabled(opts.enabledHint),
      emailArray("to", "Destinataires (À)", opts.toHint),
      emailArray("cc", "Copie (CC)"),
      emailArray("bcc", "Copie cachée (BCC)"),
      fromField,
      ...(opts.replyToHint ? [replyToField(opts.replyToHint)] : []),
      defineField({
        name: "subject",
        title: "Objet",
        description: opts.subjectHint,
        type: "string",
      }),
      defineField({
        name: "heading",
        title: "Titre de l'e-mail",
        type: "localeString",
        description:
          opts.headingHint ??
          "Le grand titre en haut de l'e-mail. Vide = le titre par défaut.",
      }),
      defineField({
        name: "intro",
        title: "Texte d'introduction",
        type: "localeText",
        description:
          opts.introHint ??
          "Le message avant les détails. Une ligne = un paragraphe. Vide = le texte par défaut.",
      }),
      defineField({
        name: "outro",
        title: "Texte de fin",
        type: "localeText",
        description:
          opts.outroHint ??
          "Ligne de clôture optionnelle, sous les détails. Vide = rien.",
      }),
      ...(opts.moderationButtons
        ? [
            defineField({
              name: "moderationButtons",
              title: "Boutons Approuver / Spam / Supprimer dans l'e-mail",
              type: "boolean",
              initialValue: true,
              description:
                "Ajoute des boutons de modération directement dans l'e-mail (chaque clic ouvre une page de confirmation). Décoché = seulement le lien vers le Studio.",
            }),
          ]
        : []),
    ],
  });
}
