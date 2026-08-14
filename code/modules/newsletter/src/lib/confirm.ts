import "server-only";

import { logger } from "@indiecrafts/logger";
import { writeClient } from "@indiecrafts/sanity/write";

/**
 * Double opt-in confirm — flips a `pending` subscriber to `confirmed` when its
 * one-time `confirmToken` matches, then clears the token (single-use). A bad or
 * already-used token is a no-op. Called by `/api/newsletter/confirm`.
 */
export async function confirmSubscriber(token: string): Promise<"confirmed" | "invalid"> {
  const t = token.trim();
  if (!t) return "invalid";
  try {
    const id = await writeClient.fetch<string | null>(
      `*[_type == "subscriber" && confirmToken == $t && status == "pending"][0]._id`,
      { t },
    );
    if (!id) return "invalid";
    await writeClient.patch(id).set({ status: "confirmed" }).unset(["confirmToken"]).commit();
    return "confirmed";
  } catch (error) {
    logger.error("newsletter confirm failed", { error });
    return "invalid";
  }
}
