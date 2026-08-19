import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/email";

/**
 * Owner alert on a new GDPR data-subject request — operational (one team, not
 * translated). The caller (`@indiecrafts/compliance`) resolves the request-type
 * label and passes it as a plain string, so this template stays free of any
 * Sanity/compliance types.
 */
export type DataRequestNotificationInput = {
  /** The right the visitor asked to exercise, already resolved to a label. */
  requestTypeLabel: string;
  /** The visitor's email — the address a reply/action is owed to. */
  email: string;
  /** Optional free-text detail the visitor added. */
  message?: string;
  /** Page the request came from. */
  source?: string;
  /** Studio link where the `dataRequest` record can be actioned. */
  studioUrl: string;
  /** Optional subject with `{{type}}` / `{{email}}` placeholders. */
  subjectTemplate?: string;
  /** Editor overrides (resolved strings) — empty falls back to the defaults below. */
  heading?: string;
  intro?: string;
  outro?: string;
};

const C = EMAIL_COLORS;
const DEFAULT_HEADING = "Nouvelle demande RGPD";
const DEFAULT_INTRO =
  "Une nouvelle demande d'exercice de droits (RGPD) a été reçue. Elle doit être traitée sous un mois.";

export function renderDataRequestNotificationEmail(
  input: DataRequestNotificationInput,
): RenderedEmail {
  const subject = (
    input.subjectTemplate?.trim() || "Nouvelle demande RGPD : {{type}}"
  )
    .replaceAll("{{type}}", input.requestTypeLabel)
    .replaceAll("{{email}}", input.email);

  const heading = input.heading?.trim() || DEFAULT_HEADING;
  const intro = input.intro?.trim() || DEFAULT_INTRO;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    `Type de demande : ${input.requestTypeLabel}`,
    `E-mail du demandeur : ${input.email}`,
    ...(input.source ? [`Source : ${input.source}`] : []),
    ...(input.message ? ["", "Message :", input.message] : []),
    "",
    "À traiter sous un mois (délai légal RGPD).",
    `Voir la demande dans le Studio : ${input.studioUrl}`,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const messageHtml = input.message
    ? `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Message</p>` +
      `<blockquote style="margin:0 0 20px;padding:14px 18px;background:${C.panel};border-left:3px solid ${C.border};border-radius:6px;color:${C.body};font-size:15px;line-height:1.6">${escapeHtml(input.message).replaceAll("\n", "<br>")}</blockquote>`
    : "";

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Type de demande</p>`,
    `<p style="margin:0 0 16px;font-size:15px">${escapeHtml(input.requestTypeLabel)}</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">E-mail du demandeur</p>`,
    `<p style="margin:0 0 20px;font-size:15px">${escapeHtml(input.email)}</p>`,
    input.source
      ? `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Source</p><p style="margin:0 0 20px;font-size:15px">${escapeHtml(input.source)}</p>`
      : "",
    messageHtml,
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Voir la demande</a>`,
    outro
      ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: heading,
    preheader: `${input.requestTypeLabel} — ${input.email}`,
    contentHtml,
    lang: "fr",
  });

  return { subject, text, html };
}
