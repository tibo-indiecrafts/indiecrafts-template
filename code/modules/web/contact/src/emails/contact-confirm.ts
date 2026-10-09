/**
 * Render the sender-facing "we got your message" contact acknowledgement email.
 *
 * @see docs/reference/modules/web/contact/src/emails/contact-confirm.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";
import { localeCopy } from "@indiecrafts/packages-shared-config";

/**
 * "We got your message" acknowledgement → the person who sent the contact form.
 * **Copy-agnostic**: the caller resolves the sender-locale strings (from Sanity
 * `emailStrings`, else `contactConfirmDefaults`) and passes them in. No link — a contact ack just reassures;
 * `intro`/`outro` may be multi-line (one `<p>` per line).
 */
export type ContactConfirmInput = {
  subject: string;
  heading: string;
  intro: string;
  outro?: string;
  /** The recipient's language — the layout's `<html lang>` and footer. */
  locale: string;
  supportEmail?: string;
};

type ConfirmCopy = Pick<ContactConfirmInput, "subject" | "heading" | "intro">;

/** Last-resort copy when a Studio field is empty, per locale; another locale gets the default locale's, else English (`localeCopy`). */
const EN: ConfirmCopy = {
  subject: "We received your message",
  heading: "Thanks for getting in touch",
  intro: "We received your message and will reply as soon as we can.",
};

const CONFIRM_DEFAULTS: Record<string, ConfirmCopy> = {
  en: EN,
  fr: {
    subject: "Nous avons bien reçu votre message",
    heading: "Merci de nous avoir écrit",
    intro:
      "Nous avons bien reçu votre message et nous vous répondrons dès que possible.",
  },
};

/** The fallback acknowledgement copy for `locale` (else the default locale's, else English). */
export function contactConfirmDefaults(locale: string): ConfirmCopy {
  return localeCopy(CONFIRM_DEFAULTS, locale);
}

const C = EMAIL_COLORS;

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

export function renderContactConfirmEmail(
  input: ContactConfirmInput,
): RenderedEmail {
  const text = [input.intro, ...(input.outro ? ["", input.outro] : [])].join(
    "\n",
  );

  const contentHtml = [
    paragraphs(input.intro),
    input.outro
      ? `<p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(input.outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  return renderEmail({
    subject: input.subject,
    text,
    title: input.heading,
    preheader: input.intro.slice(0, 100),
    contentHtml,
    lang: input.locale,
    supportEmail: input.supportEmail,
  });
}
