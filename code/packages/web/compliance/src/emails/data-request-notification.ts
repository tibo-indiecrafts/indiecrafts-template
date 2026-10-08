/**
 * Renders the owner alert email for a new GDPR data-subject request.
 *
 * @see docs/reference/packages/web/compliance/src/emails/data-request-notification.md
 */

import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/**
 * Owner alert on a new GDPR data-subject request — follows the site's default
 * locale. The caller (`@indiecrafts/packages-web-compliance`) resolves the request-type
 * label and passes it as a plain string, so this template stays free of any
 * Sanity/compliance types.
 */
export type DataRequestNotificationInput = {
  /** The operator's locale — the site's `defaultLocale`; any locale without copy gets English. */
  locale?: string;
  /** The right the visitor asked to exercise, already resolved to a label. */
  requestTypeLabel: string;
  /** The visitor's email — the address a reply/action is owed to. */
  email: string;
  /** Optional free-text detail the visitor added. */
  message?: string;
  /** Page the request came from. */
  source?: string;
  /** Admin "Data requests" screen where the request is actioned. Unset → the email
   *  names the screen instead of linking it. */
  reviewUrl?: string;
  /** Optional subject with `{{type}}` / `{{email}}` placeholders. */
  subjectTemplate?: string;
  /** Editor overrides (resolved strings) — empty falls back to the defaults below. */
  heading?: string;
  intro?: string;
  outro?: string;
  supportEmail?: string;
};

const C = EMAIL_COLORS;

/** Last-resort copy when a Studio field is empty, per locale; any other locale gets English. */
const EN = {
  heading: "New GDPR request",
  intro:
    "A new data-subject rights request (GDPR) arrived. It must be handled within one month.",
  subject: "New GDPR request: {{type}}",
  colon: ":",
  type: "Request type",
  email: "Requester email",
  source: "Source",
  message: "Message",
  deadline: "Handle within one month (GDPR legal deadline).",
  view: "View the request",
  viewInAdmin: "View the request in the admin, “Data requests” screen.",
};

const COPY: Record<string, typeof EN> = {
  en: EN,
  fr: {
    heading: "Nouvelle demande RGPD",
    intro:
      "Une nouvelle demande d'exercice de droits (RGPD) a été reçue. Elle doit être traitée sous un mois.",
    subject: "Nouvelle demande RGPD : {{type}}",
    colon: " :",
    type: "Type de demande",
    email: "E-mail du demandeur",
    source: "Source",
    message: "Message",
    deadline: "À traiter sous un mois (délai légal RGPD).",
    view: "Voir la demande",
    viewInAdmin: "Voir la demande dans l'admin, écran « Data requests ».",
  },
};

export function renderDataRequestNotificationEmail(
  input: DataRequestNotificationInput,
): RenderedEmail {
  const lang = input.locale && COPY[input.locale] ? input.locale : "en";
  const copy = COPY[lang] ?? EN;
  const subject = (input.subjectTemplate?.trim() || copy.subject)
    .replaceAll("{{type}}", input.requestTypeLabel)
    .replaceAll("{{email}}", input.email);

  const heading = input.heading?.trim() || copy.heading;
  const intro = input.intro?.trim() || copy.intro;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    `${copy.type}${copy.colon} ${input.requestTypeLabel}`,
    `${copy.email}${copy.colon} ${input.email}`,
    ...(input.source ? [`${copy.source}${copy.colon} ${input.source}`] : []),
    ...(input.message
      ? ["", `${copy.message}${copy.colon}`, input.message]
      : []),
    "",
    copy.deadline,
    input.reviewUrl
      ? `${copy.view}${copy.colon} ${input.reviewUrl}`
      : copy.viewInAdmin,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const messageHtml = input.message
    ? `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.message}</p>` +
      `<blockquote style="margin:0 0 20px;padding:14px 18px;background:${C.panel};border-left:3px solid ${C.border};border-radius:6px;color:${C.body};font-size:15px;line-height:1.6">${escapeHtml(input.message).replaceAll("\n", "<br>")}</blockquote>`
    : "";

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.type}</p>`,
    `<p style="margin:0 0 16px;font-size:15px">${escapeHtml(input.requestTypeLabel)}</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.email}</p>`,
    `<p style="margin:0 0 20px;font-size:15px">${escapeHtml(input.email)}</p>`,
    input.source
      ? `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.source}</p><p style="margin:0 0 20px;font-size:15px">${escapeHtml(input.source)}</p>`
      : "",
    messageHtml,
    input.reviewUrl
      ? `<a href="${escapeHtml(input.reviewUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${copy.view}</a>`
      : `<p style="margin:0;font-size:14px;color:${C.muted}">${copy.viewInAdmin}</p>`,
    outro
      ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: heading,
    preheader: `${input.requestTypeLabel} — ${input.email}`,
    contentHtml,
    lang,
    supportEmail: input.supportEmail,
  });

  return { subject, text, html };
}
