/**
 * Confirms a pending subscriber from its one-time double opt-in token.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/confirm.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import { deliverMagnetsForTags } from "./deliver-magnet";
import { wantsNewsletter } from "./purpose";
import { syncNewsletterContact } from "./newsletter-contact";

/** A confirmation link works this many days; after that the visitor signs up again. */
export const CONFIRM_TOKEN_DAYS = 7;

/**
 * Double opt-in confirm — flips a `pending` subscriber to `confirmed` when its
 * one-time `confirmToken` matches, then clears the token (single-use). A bad,
 * already-used or expired token (older than `CONFIRM_TOKEN_DAYS`) is a no-op. Called
 * by `/api/newsletter/confirm`.
 *
 * On success, if the subscriber signed up via a `module.lead-magnet` block (the
 * magnet doc id is stored in `tags`), the gated download is e-mailed — best-effort,
 * so a delivery failure never turns a real confirmation into an error. A newsletter
 * sign-up (not a lead-magnet-only one) is then mirrored to Resend's `news` topic.
 */
export async function confirmSubscriber(
  token: string,
  now: Date = new Date(),
): Promise<"confirmed" | "invalid"> {
  const t = token.trim();
  if (!t) return "invalid";
  const since = new Date(
    now.getTime() - CONFIRM_TOKEN_DAYS * 86_400_000,
  ).toISOString();
  try {
    const doc = await writeClient.fetch<{
      _id: string;
      email: string;
      language?: string;
      tags?: string[];
      newsletter?: boolean | null;
      source?: string | null;
    } | null>(
      `*[_type == "subscriber" && confirmToken == $t && status == "pending" && confirmTokenAt > $since][0]{ _id, email, language, tags, newsletter, source }`,
      { t, since },
    );
    if (!doc?._id) return "invalid";
    await writeClient
      .patch(doc._id)
      .set({ status: "confirmed" })
      .unset(["confirmToken", "confirmTokenAt"])
      .commit();
    await deliverMagnetsForTags(doc.email, doc.tags, doc.language);
    if (wantsNewsletter(doc))
      await syncNewsletterContact({
        email: doc.email,
        locale: doc.language ?? defaultLocale,
        granted: true,
      });
    return "confirmed";
  } catch (error) {
    logger.error("newsletter confirm failed", { error });
    return "invalid";
  }
}
