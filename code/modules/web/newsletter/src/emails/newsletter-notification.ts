/**
 * Renders the owner alert email for a new newsletter subscriber.
 *
 * @see docs/reference/modules/web/newsletter/src/emails/newsletter-notification.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Owner alert on a new subscriber — follows the site's default locale. */
export type NewsletterNotificationInput = {
  /** The operator's locale — the site's `defaultLocale`; any locale without copy gets English. */
  locale?: string;
  subscriberEmail: string;
  source?: string;
  studioUrl: string;
  /** Optional subject with a `{{email}}` placeholder. */
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
  heading: "New subscriber",
  intro: "Someone just subscribed to the newsletter.",
  subject: "New newsletter subscriber: {{email}}",
  colon: ":",
  email: "Email",
  source: "Source",
  studioText: "View subscribers in the Studio",
  studioButton: "View subscribers",
};

const COPY: Record<string, typeof EN> = {
  en: EN,
  fr: {
    heading: "Nouvel abonné",
    intro: "Un nouvel abonné vient de s'inscrire à l'infolettre.",
    subject: "Nouvel abonné à l'infolettre : {{email}}",
    colon: " :",
    email: "E-mail",
    source: "Source",
    studioText: "Voir les abonnés dans le Studio",
    studioButton: "Voir les abonnés",
  },
};

export function renderNewsletterNotificationEmail(
  input: NewsletterNotificationInput,
): RenderedEmail {
  const lang = input.locale && COPY[input.locale] ? input.locale : "en";
  const copy = COPY[lang] ?? EN;
  const subject = (input.subjectTemplate?.trim() || copy.subject).replaceAll(
    "{{email}}",
    input.subscriberEmail,
  );

  const heading = input.heading?.trim() || copy.heading;
  const intro = input.intro?.trim() || copy.intro;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    `${copy.email}${copy.colon} ${input.subscriberEmail}`,
    ...(input.source ? [`${copy.source}${copy.colon} ${input.source}`] : []),
    "",
    `${copy.studioText}${copy.colon} ${input.studioUrl}`,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.email}</p>`,
    `<p style="margin:0 0 16px;font-size:15px">${escapeHtml(input.subscriberEmail)}</p>`,
    input.source
      ? `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.source}</p><p style="margin:0 0 20px;font-size:15px">${escapeHtml(input.source)}</p>`
      : "",
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${copy.studioButton}</a>`,
    outro
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: heading,
    preheader: input.subscriberEmail,
    contentHtml,
    lang,
    supportEmail: input.supportEmail,
  });

  return { subject, text, html };
}
