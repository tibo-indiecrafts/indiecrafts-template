/**
 * Renders the owner alert email for a new waitlist entry.
 *
 * @see docs/reference/modules/web/waitlist/src/emails/waitlist-notification.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Owner alert on a new waitlist entry — follows the site's default locale. */
export type WaitlistNotificationInput = {
  /** The operator's locale — the site's `defaultLocale`; any locale without copy gets English. */
  locale?: string;
  email: string;
  name?: string;
  source?: string;
  studioUrl: string;
  /** Optional subject with `{{email}}` / `{{name}}` placeholders. */
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
  heading: "New sign-up",
  intro: "Someone new joined the waitlist.",
  subject: "New waitlist sign-up: {{email}}",
  colon: ":",
  name: "Name",
  email: "Email",
  source: "Source",
  studioText: "View the list in the Studio",
  studioButton: "View the list",
};

const COPY: Record<string, typeof EN> = {
  en: EN,
  fr: {
    heading: "Nouvelle inscription",
    intro: "Une nouvelle personne a rejoint la liste d'attente.",
    subject: "Nouvelle inscription à la liste d'attente : {{email}}",
    colon: " :",
    name: "Nom",
    email: "E-mail",
    source: "Source",
    studioText: "Voir la liste dans le Studio",
    studioButton: "Voir la liste",
  },
};

export function renderWaitlistNotificationEmail(
  input: WaitlistNotificationInput,
): RenderedEmail {
  const lang = input.locale && COPY[input.locale] ? input.locale : "en";
  const copy = COPY[lang] ?? EN;
  const subject = (input.subjectTemplate?.trim() || copy.subject)
    .replaceAll("{{email}}", input.email)
    .replaceAll("{{name}}", input.name ?? "");

  const heading = input.heading?.trim() || copy.heading;
  const intro = input.intro?.trim() || copy.intro;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    ...(input.name ? [`${copy.name}${copy.colon} ${input.name}`] : []),
    `${copy.email}${copy.colon} ${input.email}`,
    ...(input.source ? [`${copy.source}${copy.colon} ${input.source}`] : []),
    "",
    `${copy.studioText}${copy.colon} ${input.studioUrl}`,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${label}</p><p style="margin:0 0 16px;font-size:15px;color:${C.body}">${escapeHtml(value)}</p>`;

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    input.name ? row(copy.name, input.name) : "",
    row(copy.email, input.email),
    input.source ? row(copy.source, input.source) : "",
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${copy.studioButton}</a>`,
    outro
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: heading,
    preheader: input.name || input.email,
    contentHtml,
    lang,
    supportEmail: input.supportEmail,
  });

  return { subject, text, html };
}
