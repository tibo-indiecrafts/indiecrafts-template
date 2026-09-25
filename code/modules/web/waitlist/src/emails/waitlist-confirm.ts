/**
 * Renders the waitlist confirmation email.
 *
 * @see docs/reference/modules/web/waitlist/src/emails/waitlist-confirm.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/**
 * "You're on the list" confirmation → the new waitlist joiner. **Copy-agnostic**:
 * the caller resolves the joiner-locale strings (from Sanity `emailStrings`) and
 * passes them in. No confirm-link — a waitlist just welcomes; `intro`/`outro` may
 * be multi-line (one `<p>` per line).
 */
export type WaitlistConfirmInput = {
  subject: string;
  heading: string;
  intro: string;
  outro?: string;
  supportEmail?: string;
};

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

  const html = renderEmailLayout({
    title: input.heading,
    preheader: input.intro.slice(0, 100),
    contentHtml,
    supportEmail: input.supportEmail,
  });

  return { subject: input.subject, text, html };
}
