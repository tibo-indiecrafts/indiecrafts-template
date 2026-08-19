import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/email";

/**
 * Lead-magnet delivery → a subscriber who just confirmed their e-mail. Sends the
 * gated download link. **Copy-agnostic**: the caller (the newsletter module)
 * resolves the subscriber-locale strings and passes them in. `intro` may be
 * multi-line (rendered one `<p>` per line). The link is a signed, expiring token
 * URL (`@indiecrafts/gated-delivery`) — opaque here, just interpolated.
 */
export type LeadMagnetInput = {
  subject: string;
  heading: string;
  intro: string;
  buttonLabel: string;
  downloadUrl: string;
  outro?: string;
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

export function renderLeadMagnetEmail(input: LeadMagnetInput): RenderedEmail {
  const text = [
    input.intro,
    "",
    `${input.buttonLabel}: ${input.downloadUrl}`,
    ...(input.outro ? ["", input.outro] : []),
  ].join("\n");

  const contentHtml = [
    paragraphs(input.intro),
    `<p style="margin:24px 0"><a href="${escapeHtml(input.downloadUrl)}" style="display:inline-block;padding:12px 22px;background:${C.accent};color:${C.accentForeground};border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">${escapeHtml(input.buttonLabel)}</a></p>`,
    input.outro
      ? `<p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(input.outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: input.heading,
    preheader: input.intro.slice(0, 100),
    contentHtml,
  });

  return { subject: input.subject, text, html };
}
