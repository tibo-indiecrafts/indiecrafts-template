/**
 * Render the owner-facing alert email carrying a new contact message.
 *
 * @see docs/reference/modules/web/contact/src/emails/contact-notification.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Owner alert on a new contact message — follows the site's default locale. */
export type ContactNotificationInput = {
  /** The operator's locale — the site's `defaultLocale`; any locale without copy gets English. */
  locale?: string;
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

/** Last-resort copy when a Studio field is empty, per locale; any other locale gets English. */
const EN = {
  heading: "New message",
  intro: "Someone sent a message through the contact form.",
  subject: "New contact message: {{subject}}",
  colon: ":",
  name: "Name",
  email: "Email",
  subjectLabel: "Subject",
  source: "Source",
  message: "Message",
  studio: "View in the Studio",
};

const COPY: Record<string, typeof EN> = {
  en: EN,
  fr: {
    heading: "Nouveau message",
    intro: "Quelqu'un a envoyé un message via le formulaire de contact.",
    subject: "Nouveau message de contact : {{subject}}",
    colon: " :",
    name: "Nom",
    email: "E-mail",
    subjectLabel: "Objet",
    source: "Source",
    message: "Message",
    studio: "Voir dans le Studio",
  },
};

export function renderContactNotificationEmail(
  input: ContactNotificationInput,
): RenderedEmail {
  const lang = input.locale && COPY[input.locale] ? input.locale : "en";
  const copy = COPY[lang] ?? EN;
  const subject = (input.subjectTemplate?.trim() || copy.subject)
    .replaceAll("{{email}}", input.email)
    .replaceAll("{{name}}", input.name ?? "")
    .replaceAll("{{subject}}", input.subject || input.email);

  const heading = input.heading?.trim() || copy.heading;
  const intro = input.intro?.trim() || copy.intro;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    ...(input.name ? [`${copy.name}${copy.colon} ${input.name}`] : []),
    `${copy.email}${copy.colon} ${input.email}`,
    ...(input.subject
      ? [`${copy.subjectLabel}${copy.colon} ${input.subject}`]
      : []),
    ...(input.source ? [`${copy.source}${copy.colon} ${input.source}`] : []),
    "",
    `${copy.message}${copy.colon}`,
    input.message,
    "",
    `${copy.studio}${copy.colon} ${input.studioUrl}`,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${label}</p><p style="margin:0 0 16px;font-size:15px;color:${C.body}">${escapeHtml(value)}</p>`;

  const messageBlock = `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.message}</p><div style="margin:0 0 20px;padding:16px;background:${C.panel};border:1px solid ${C.border};border-radius:8px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(input.message).replaceAll("\n", "<br>")}</div>`;

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    input.name ? row(copy.name, input.name) : "",
    row(copy.email, input.email),
    input.subject ? row(copy.subjectLabel, input.subject) : "",
    input.source ? row(copy.source, input.source) : "",
    messageBlock,
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${copy.studio}</a>`,
    outro
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  return renderEmail({
    subject,
    text,
    title: heading,
    preheader: input.subject || input.name || input.email,
    contentHtml,
    lang,
    supportEmail: input.supportEmail,
  });
}
