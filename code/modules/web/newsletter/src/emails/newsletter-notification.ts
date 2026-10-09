/**
 * Renders the owner alert email for a newly confirmed newsletter subscriber.
 *
 * @see docs/reference/modules/web/newsletter/src/emails/newsletter-notification.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Owner alert on a new subscriber — follows the site's default locale. */
export type NewsletterNotificationInput = {
  /** The operator's locale — the site's `defaultLocale`; any locale without copy gets English. */
  locale?: string;
  subscriberEmail: string;
  /** The subscriber's language (the page they signed up on). */
  subscriberLocale?: string;
  source?: string;
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
  language: "Language",
  source: "Source",
};

const COPY: Record<string, typeof EN> = {
  en: EN,
  fr: {
    heading: "Nouvel abonné",
    intro: "Un nouvel abonné vient de s'inscrire à l'infolettre.",
    subject: "Nouvel abonné à l'infolettre : {{email}}",
    colon: " :",
    email: "E-mail",
    language: "Langue",
    source: "Source",
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
    ...(input.subscriberLocale
      ? [`${copy.language}${copy.colon} ${input.subscriberLocale}`]
      : []),
    ...(input.source ? [`${copy.source}${copy.colon} ${input.source}`] : []),
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${label}</p><p style="margin:0 0 16px;font-size:15px">${escapeHtml(value)}</p>`;

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    row(copy.email, input.subscriberEmail),
    input.subscriberLocale ? row(copy.language, input.subscriberLocale) : "",
    input.source ? row(copy.source, input.source) : "",
    outro
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  return renderEmail({
    subject,
    text,
    title: heading,
    preheader: input.subscriberEmail,
    contentHtml,
    lang,
    supportEmail: input.supportEmail,
  });
}
