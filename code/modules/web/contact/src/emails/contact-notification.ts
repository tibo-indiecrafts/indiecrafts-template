import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Owner alert on a new contact message — operational (one team, not translated). */
export type ContactNotificationInput = {
  email: string;
  message: string;
  name?: string;
  subject?: string;
  source?: string;
  studioUrl: string;
  /** Optional subject with `{{email}}` / `{{name}}` / `{{subject}}` placeholders. */
  subjectTemplate?: string;
  /** Editor overrides (resolved strings) — empty falls back to the defaults below. */
  heading?: string;
  intro?: string;
  outro?: string;
  supportEmail?: string;
};

const C = EMAIL_COLORS;
const DEFAULT_HEADING = "Nouveau message";
const DEFAULT_INTRO =
  "Quelqu'un a envoyé un message via le formulaire de contact.";

export function renderContactNotificationEmail(
  input: ContactNotificationInput,
): RenderedEmail {
  const subject = (
    input.subjectTemplate?.trim() || "Nouveau message de contact : {{subject}}"
  )
    .replaceAll("{{email}}", input.email)
    .replaceAll("{{name}}", input.name ?? "")
    .replaceAll("{{subject}}", input.subject || input.email);

  const heading = input.heading?.trim() || DEFAULT_HEADING;
  const intro = input.intro?.trim() || DEFAULT_INTRO;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    ...(input.name ? [`Nom : ${input.name}`] : []),
    `E-mail : ${input.email}`,
    ...(input.subject ? [`Objet : ${input.subject}`] : []),
    ...(input.source ? [`Source : ${input.source}`] : []),
    "",
    "Message :",
    input.message,
    "",
    `Voir dans le Studio : ${input.studioUrl}`,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${label}</p><p style="margin:0 0 16px;font-size:15px;color:${C.body}">${escapeHtml(value)}</p>`;

  const messageBlock = `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Message</p><div style="margin:0 0 20px;padding:16px;background:${C.panel};border:1px solid ${C.border};border-radius:8px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(input.message).replaceAll("\n", "<br>")}</div>`;

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    input.name ? row("Nom", input.name) : "",
    row("E-mail", input.email),
    input.subject ? row("Objet", input.subject) : "",
    input.source ? row("Source", input.source) : "",
    messageBlock,
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Voir dans le Studio</a>`,
    outro
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: heading,
    preheader: input.subject || input.name || input.email,
    contentHtml,
    lang: "fr",
    supportEmail: input.supportEmail,
  });

  return { subject, text, html };
}
