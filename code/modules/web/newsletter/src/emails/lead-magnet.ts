/**
 * Renders the lead-magnet delivery email.
 *
 * @see docs/reference/modules/web/newsletter/src/emails/lead-magnet.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";
import { localeCopy } from "@indiecrafts/packages-shared-config";

/**
 * Lead-magnet delivery → a subscriber who just confirmed their e-mail. Sends the
 * gated download link. **Copy-agnostic**: the caller (the newsletter module)
 * resolves the subscriber-locale strings and passes them in. `intro` may be
 * multi-line (rendered one `<p>` per line). The link is a signed, expiring token
 * URL (`@indiecrafts/packages-shared-gated-delivery`) — opaque here, just interpolated.
 */
export type LeadMagnetInput = {
  subject: string;
  heading: string;
  intro: string;
  buttonLabel: string;
  downloadUrl: string;
  outro?: string;
  /** The recipient's language — the layout's `<html lang>` and footer. */
  locale: string;
  supportEmail?: string;
};

type DeliveryCopy = Pick<
  LeadMagnetInput,
  "subject" | "heading" | "intro" | "buttonLabel"
>;

/** Last-resort copy when a Studio field is empty, per locale; another locale gets the default locale's, else English (`localeCopy`).
 *  The magnet's title is interpolated into the intro. */
const DEFAULTS: Record<string, (title: string) => DeliveryCopy> = {
  en: (title) => ({
    subject: "Your download is ready",
    heading: "Thanks — here's your download",
    intro: `Click the button below to download “${title}”. The link expires in 7 days.`,
    buttonLabel: "Download the file",
  }),
  fr: (title) => ({
    subject: "Votre document est prêt",
    heading: "Merci — voici votre document",
    intro: `Cliquez sur le bouton ci-dessous pour télécharger « ${title} ». Le lien expire dans 7 jours.`,
    buttonLabel: "Télécharger le document",
  }),
};

/** The fallback delivery copy for `locale` (else the default locale's, else English). */
export function leadMagnetDefaults(
  locale: string,
  title: string,
): DeliveryCopy {
  return localeCopy(DEFAULTS, locale)(title);
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
