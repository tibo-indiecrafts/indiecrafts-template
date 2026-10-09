/**
 * Renders the waitlist confirmation email.
 *
 * @see docs/reference/modules/web/waitlist/src/emails/waitlist-confirm.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";
import { localeCopy } from "@indiecrafts/packages-shared-config";

/**
 * "You're on the list" confirmation → the new waitlist joiner. **Copy-agnostic**:
 * the caller resolves the joiner-locale strings (from Sanity `emailStrings`, else
 * `waitlistConfirmDefaults`) and passes them in. No confirm-link — a waitlist just welcomes; `intro`/`outro` may
 * be multi-line (one `<p>` per line).
 */
export type WaitlistConfirmInput = {
  subject: string;
  heading: string;
  intro: string;
  outro?: string;
  /** The recipient's language — the layout's `<html lang>` and footer. */
  locale: string;
  supportEmail?: string;
};

type ConfirmCopy = Pick<WaitlistConfirmInput, "subject" | "heading" | "intro">;

/** Last-resort copy when a Studio field is empty, per locale; another locale gets the default locale's, else English (`localeCopy`). */
const CONFIRM_DEFAULTS: Record<string, (name?: string) => ConfirmCopy> = {
  en: (name) => ({
    subject: "You're on the waitlist",
    heading: "Welcome to the list",
    intro: `Thanks${name ? ` ${name}` : ""}! Your spot on the waitlist is saved. We will contact you as soon as access opens.`,
  }),
  fr: (name) => ({
    subject: "Vous êtes sur la liste d'attente",
    heading: "Bienvenue sur la liste",
    intro: `Merci${name ? ` ${name}` : ""} ! Votre place sur la liste d'attente est réservée. Nous vous contacterons dès que l'accès sera disponible.`,
  }),
};

/** The fallback welcome copy for `locale` (else the default locale's, else English). */
export function waitlistConfirmDefaults(
  locale: string,
  name?: string,
): ConfirmCopy {
  return localeCopy(CONFIRM_DEFAULTS, locale)(name);
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

export function renderWaitlistConfirmEmail(
  input: WaitlistConfirmInput,
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
