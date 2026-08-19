import "server-only";

import { logger } from "@indiecrafts/logger";
import { writeClient } from "@indiecrafts/sanity/write";

export type ModerationAction = "approve" | "spam" | "delete";

export function isModerationAction(value: unknown): value is ModerationAction {
  return value === "approve" || value === "spam" || value === "delete";
}

export type ModerationComment = {
  _id: string;
  authorName?: string | null;
  body?: string | null;
  post?: string | null;
};

/**
 * The comment behind a moderation token — for the confirm page. `null` when the
 * token is invalid or already used (so the page shows "lien expiré"). Read-only.
 */
export async function getModerationComment(
  token: string,
): Promise<ModerationComment | null> {
  const t = token.trim();
  if (!t) return null;
  try {
    return await writeClient.fetch<ModerationComment | null>(
      `*[_type == "comment" && moderationToken == $t][0]{ _id, authorName, body, "post": post->title }`,
      { t },
    );
  } catch (error) {
    logger.error("moderation lookup failed", { error });
    return null;
  }
}

/**
 * Perform a one-click moderation action. Single-use: the token is cleared (or the
 * doc deleted), so the link can't be replayed. `approve` publishes, `spam` hides +
 * flags, `delete` removes. Returns `"invalid"` for a used/unknown token.
 */
export async function moderateComment(
  token: string,
  action: ModerationAction,
): Promise<"done" | "invalid"> {
  const t = token.trim();
  if (!t) return "invalid";
  try {
    const id = await writeClient.fetch<string | null>(
      `*[_type == "comment" && moderationToken == $t][0]._id`,
      { t },
    );
    if (!id) return "invalid";

    if (action === "delete") {
      // May fail if an approved reply still references this comment (Sanity blocks
      // it) — the caller surfaces the error. New comments have no replies.
      await writeClient.delete(id);
      return "done";
    }

    const patch =
      action === "approve"
        ? { approved: true, spam: false }
        : { approved: false, spam: true };
    await writeClient.patch(id).set(patch).unset(["moderationToken"]).commit();
    return "done";
  } catch (error) {
    logger.error("moderation action failed", { action, error });
    return "invalid";
  }
}
