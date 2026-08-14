import { escapeHtml, renderEmailLayout } from "../layout";
import type { RenderedEmail } from "./comment-notification";

/** Owner alert on a new waitlist entry — operational (one team, not translated). */
export type WaitlistNotificationInput = {
  email: string;
  name?: string;
  source?: string;
  studioUrl: string;
  /** Optional subject with `{{email}}` / `{{name}}` placeholders. */
  subjectTemplate?: string;
};

const C = { muted: "#6b7280", body: "#374151" };

export function renderWaitlistNotificationEmail(input: WaitlistNotificationInput): RenderedEmail {
  const subject = (input.subjectTemplate?.trim() || "Nouvelle inscription à la liste d'attente : {{email}}")
    .replaceAll("{{email}}", input.email)
    .replaceAll("{{name}}", input.name ?? "");

  const text = [
    "Une nouvelle personne a rejoint la liste d'attente.",
    "",
    ...(input.name ? [`Nom : ${input.name}`] : []),
    `E-mail : ${input.email}`,
    ...(input.source ? [`Source : ${input.source}`] : []),
    "",
    `Voir la liste dans le Studio : ${input.studioUrl}`,
  ].join("\n");

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${label}</p><p style="margin:0 0 16px;font-size:15px;color:${C.body}">${escapeHtml(value)}</p>`;

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">Une nouvelle personne a rejoint la liste d'attente.</p>`,
    input.name ? row("Nom", input.name) : "",
    row("E-mail", input.email),
    input.source ? row("Source", input.source) : "",
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:#111827;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Voir la liste</a>`,
  ].join("");

  const html = renderEmailLayout({ title: "Nouvelle inscription", preheader: input.name || input.email, contentHtml, lang: "fr" });

  return { subject, text, html };
}
