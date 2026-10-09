/**
 * Renders the newsletter double opt-in confirmation email.
 *
 * @see docs/reference/modules/web/newsletter/src/emails/newsletter-confirm.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/**
 * Double opt-in confirmation → the new subscriber. **Copy-agnostic**: the caller
 * resolves the subscriber-locale strings (Sanity `emailStrings.newsletterConfirm`, else
 * `confirmEmailDefaults`) and passes them in. `intro`/`outro` may be multi-line (rendered one `<p>` per line).
 */
export type NewsletterConfirmInput = {
  subject: string;
  heading: string;
  intro: string;
  buttonLabel: string;
  confirmUrl: string;
  outro?: string;
  supportEmail?: string;
};

type ConfirmCopy = Pick<
  NewsletterConfirmInput,
  "subject" | "heading" | "intro" | "buttonLabel"
>;

/**
 * Last-resort copy when a Studio field is empty (E-mails → newsletter confirmation), per
 * locale; any other locale gets English. The seed fills the real copy in both languages.
 */
const EN: ConfirmCopy = {
  subject: "Confirm your subscription",
  heading: "One last step",
  intro:
    "Thanks! Confirm your email address to start receiving the newsletter.",
  buttonLabel: "Confirm my subscription",
};

const CONFIRM_DEFAULTS: Record<string, ConfirmCopy> = {
  en: EN,
  fr: {
    subject: "Confirmez votre inscription",
    heading: "Plus qu'une étape",
    intro: "Merci ! Confirmez votre adresse e-mail pour recevoir l'infolettre.",
    buttonLabel: "Confirmer mon inscription",
  },
};

/** A lead-magnet request asks for a document, not the newsletter: its copy says so. */
const LEAD_EN: ConfirmCopy = {
  subject: "Confirm your request",
  heading: "One last step",
  intro:
    "Thanks! Confirm your email address to receive the document you asked for. This does not subscribe you to the newsletter.",
  buttonLabel: "Get the document",
};

const LEAD_DEFAULTS: Record<string, ConfirmCopy> = {
  en: LEAD_EN,
  fr: {
    subject: "Confirmez votre demande",
    heading: "Plus qu'une étape",
    intro:
      "Merci ! Confirmez votre adresse e-mail pour recevoir le document demandé. Cela ne vous inscrit pas à l'infolettre.",
    buttonLabel: "Recevoir le document",
  },
};

/** The fallback confirmation copy for `locale` (English when there is none), per purpose. */
export function confirmEmailDefaults(
  locale: string,
  purpose: "newsletter" | "lead-magnet" = "newsletter",
): ConfirmCopy {
  return purpose === "lead-magnet"
    ? (LEAD_DEFAULTS[locale] ?? LEAD_EN)
    : (CONFIRM_DEFAULTS[locale] ?? EN);
}

const C = EMAIL_COLORS;

/** Multi-line text → escaped `<p>` blocks (blank lines dropped). */
function paragraphs(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (line) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(line)}</p>`,
    )
    .join("");
}

export function renderNewsletterConfirmEmail(
  input: NewsletterConfirmInput,
): RenderedEmail {
  const text = [
    input.intro,
    "",
    `${input.buttonLabel}: ${input.confirmUrl}`,
    ...(input.outro ? ["", input.outro] : []),
  ].join("\n");

  const contentHtml = [
    paragraphs(input.intro),
    `<p style="margin:24px 0"><a href="${escapeHtml(input.confirmUrl)}" style="display:inline-block;padding:12px 22px;background:${C.accent};color:${C.accentForeground};border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">${escapeHtml(input.buttonLabel)}</a></p>`,
    input.outro
      ? `<p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(input.outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: input.heading,
    preheader: input.intro.slice(0, 100),
    contentHtml,
    supportEmail: input.supportEmail,
  });

  return { subject: input.subject, text, html };
}
