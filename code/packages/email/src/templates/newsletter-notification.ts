import { escapeHtml, renderEmailLayout } from "../layout";
import type { RenderedEmail } from "./comment-notification";

/** Owner alert on a new subscriber — operational (one team, not translated). */
export type NewsletterNotificationInput = {
  subscriberEmail: string;
  source?: string;
  studioUrl: string;
  /** Optional subject with a `{{email}}` placeholder. */
  subjectTemplate?: string;
};

const C = { muted: "#6b7280", accent: "#4f46e5", body: "#374151" };

export function renderNewsletterNotificationEmail(input: NewsletterNotificationInput): RenderedEmail {
  const subject = (input.subjectTemplate?.trim() || "Nouvel abonné à l'infolettre : {{email}}").replaceAll(
    "{{email}}",
    input.subscriberEmail,
  );

  const text = [
    "Un nouvel abonné vient de s'inscrire à l'infolettre.",
    "",
    `E-mail : ${input.subscriberEmail}`,
    ...(input.source ? [`Source : ${input.source}`] : []),
    "",
    `Voir les abonnés dans le Studio : ${input.studioUrl}`,
  ].join("\n");

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">Un nouvel abonné vient de s'inscrire à l'infolettre.</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">E-mail</p>`,
    `<p style="margin:0 0 16px;font-size:15px">${escapeHtml(input.subscriberEmail)}</p>`,
    input.source
      ? `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Source</p><p style="margin:0 0 20px;font-size:15px">${escapeHtml(input.source)}</p>`
      : "",
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:#111827;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Voir les abonnés</a>`,
  ].join("");

  const html = renderEmailLayout({ title: "Nouvel abonné", preheader: input.subscriberEmail, contentHtml, lang: "fr" });

  return { subject, text, html };
}
