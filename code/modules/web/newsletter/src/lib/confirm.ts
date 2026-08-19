import "server-only";

import { logger } from "@indiecrafts/logger";
import { writeClient } from "@indiecrafts/sanity/write";
import { deliverMagnetsForTags } from "./deliver-magnet";

/**
 * Double opt-in confirm — flips a `pending` subscriber to `confirmed` when its
 * one-time `confirmToken` matches, then clears the token (single-use). A bad or
 * already-used token is a no-op. Called by `/api/newsletter/confirm`.
 *
 * On success, if the subscriber signed up via a `module.lead-magnet` block (the
 * magnet doc id is stored in `tags`), the gated download is e-mailed — best-effort,
 * so a delivery failure never turns a real confirmation into an error.
 */
export async function confirmSubscriber(
  token: string,
): Promise<"confirmed" | "invalid"> {
  const t = token.trim();
  if (!t) return "invalid";
  try {
    const doc = await writeClient.fetch<{
      _id: string;
      email: string;
      language?: string;
      tags?: string[];
    } | null>(
      `*[_type == "subscriber" && confirmToken == $t && status == "pending"][0]{ _id, email, language, tags }`,
      { t },
    );
    if (!doc?._id) return "invalid";
    await writeClient
      .patch(doc._id)
      .set({ status: "confirmed" })
      .unset(["confirmToken"])
      .commit();
    await deliverMagnetsForTags(doc.email, doc.tags, doc.language);
    return "confirmed";
  } catch (error) {
    logger.error("newsletter confirm failed", { error });
    return "invalid";
  }
}
