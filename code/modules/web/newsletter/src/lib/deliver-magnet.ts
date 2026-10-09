/**
 * Delivers gated lead-magnet downloads to confirmed subscribers.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/deliver-magnet.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import { site, toSiteLocale } from "@indiecrafts/packages-shared-config";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";
import { sendEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type ConfirmationConfig,
} from "@indiecrafts/packages-web-email/strings";
import {
  leadMagnetDefaults,
  renderLeadMagnetEmail,
} from "../emails/lead-magnet";
import {
  resolveGatedDownload,
  signDownloadToken,
} from "@indiecrafts/packages-shared-gated-delivery";

/**
 * Lead-magnet delivery — the step that fires AFTER the visitor confirms their
 * e-mail. A `module.lead-magnet` capture block puts the referenced `leadMagnet` doc id
 * in the confirm link's `tags`; on confirm (`lib/confirm.ts`) we sign a short
 * gated-delivery token (`@indiecrafts/packages-shared-gated-delivery`) and e-mail the download
 * link. The `/api/download` route verifies the token, then resolves the file URL.
 *
 * Signed with `NEWSLETTER_SECRET` (server-only, never `NEXT_PUBLIC_`), the same secret as
 * the confirm link — absent, no token can be signed or verified, so the feature is off.
 * The link is signed + expiring, not single-use.
 */
const secret = () => process.env.NEWSLETTER_SECRET;
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type Magnet = { _id: string; title?: string };

/** Fetch an enabled magnet that has a file, by id. Null = not a magnet / disabled. */
async function getMagnet(id: string): Promise<Magnet | null> {
  return writeClient.fetch<Magnet | null>(
    `*[_type == "leadMagnet" && _id == $id && enabled == true && defined(asset.asset)][0]{ _id, title }`,
    { id },
  );
}

/**
 * Resolve a magnet's file URL — called by `/api/download` ONLY after the signed
 * token verifies, so the CDN URL is never exposed to an unconfirmed request.
 */
export async function getLeadMagnetAssetUrl(
  id: string,
): Promise<string | null> {
  return writeClient.fetch<string | null>(
    `*[_type == "leadMagnet" && _id == $id && enabled == true][0].asset.asset->url`,
    { id },
  );
}

/**
 * Verify a download token + resolve the file URL. The app's `/api/download`
 * route delegates here so the app never imports `@indiecrafts/packages-shared-gated-delivery`
 * directly (the newsletter module owns the magnet data + the secret).
 */
export async function resolveMagnetDownload(
  token: string,
): Promise<{ ok: true; url: string } | { ok: false; status: 403 }> {
  const key = secret();
  if (!key || !token) return { ok: false, status: 403 };
  return resolveGatedDownload(token, key, getLeadMagnetAssetUrl);
}

/**
 * Deliver every lead magnet a confirmed request asked for. The capture block puts the
 * magnet doc id in `tags`; a tag that isn't a magnet is a no-op.
 * Best-effort — a mail/lookup failure must never fail the confirmation.
 */
export async function deliverMagnetsForTags(
  email: string,
  tags: string[] | undefined,
  language: string | undefined,
): Promise<void> {
  if (!secret() || !tags?.length) return;
  for (const tag of tags) {
    try {
      const magnet = await getMagnet(tag);
      if (!magnet) continue;
      await sendMagnetEmail(email, magnet, language);
    } catch (error) {
      logger.error("lead magnet delivery failed", { tag, error });
    }
  }
}

/** Sign the download link + send it. Reuses the newsletter sender identity. */
async function sendMagnetEmail(
  email: string,
  magnet: Magnet,
  language: string | undefined,
): Promise<void> {
  const key = secret();
  if (!key || !process.env.RESEND_API_KEY) return;
  const strings = (await getEmailStrings()) as {
    newsletterConfirm?: ConfirmationConfig;
    leadMagnet?: ConfirmationConfig;
    supportEmail?: string;
    bccAll?: string;
  } | null;
  const lead = strings?.leadMagnet;
  // Own sender if set, else reuse the newsletter's verified sender identity.
  const from = lead?.from?.trim() || strings?.newsletterConfirm?.from?.trim();
  if (!from) return;

  // Editor copy (translated, resolved to the subscriber's language) with the
  // template defaults as the per-field fallback — an empty group keeps today's mail.
  const title = magnet.title ?? "";
  const locale = toSiteLocale(language);
  const fallback = leadMagnetDefaults(locale, title);
  const intro = pick(lead?.intro, locale);
  const token = await signDownloadToken(
    { assetId: magnet._id, exp: Date.now() + TTL_MS },
    key,
  );
  const message = renderLeadMagnetEmail({
    subject: pick(lead?.subject, locale) || fallback.subject,
    heading: pick(lead?.heading, locale) || fallback.heading,
    intro: intro ? intro.replaceAll("{{title}}", title) : fallback.intro,
    buttonLabel: pick(lead?.buttonLabel, locale) || fallback.buttonLabel,
    outro: pick(lead?.outro, locale) || undefined,
    downloadUrl: `${site.url}/api/download?token=${encodeURIComponent(token)}`,
    locale,
    supportEmail: strings?.supportEmail,
  });
  // CMS bcc honored only behind the infra gate (unset in prod). QA-only.
  const bccAll = process.env.EMAIL_BCC_ALL_ENABLED
    ? strings?.bccAll?.trim()
    : undefined;
  await sendEmail({
    from,
    to: [email],
    ...(bccAll ? { bcc: [bccAll] } : {}),
    ...message,
  });
}
