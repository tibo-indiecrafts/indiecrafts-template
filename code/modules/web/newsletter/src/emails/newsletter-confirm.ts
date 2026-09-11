import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/**
 * Double opt-in confirmation → the new subscriber. **Copy-agnostic**: the caller
 * resolves the subscriber-locale strings (from Sanity `newsletterSettings`) and
 * passes them in. `intro`/`outro` may be multi-line (rendered one `<p>` per line).
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
