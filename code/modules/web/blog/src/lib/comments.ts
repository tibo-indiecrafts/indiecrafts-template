/**
 * Validate and create a blog comment as an unapproved document.
 *
 * @see docs/reference/modules/web/blog/src/lib/comments.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";
import { notifyNewComment } from "./notify-comment";

/**
 * Comment submission — the single runtime write path. Validates the input, then
 * creates a `comment` document with `approved: false` (invisible until an editor
 * approves). Fields are **whitelisted** and `_type` is hard-coded — the request
 * body is never spread into the mutation. Output is rendered as escaped text by
 * React, so no markup can execute.
 *
 * Honeypot: a hidden form field only bots fill. When it's non-empty we treat the
 * submission as spam and drop it silently (the caller still returns success so
 * bots learn nothing).
 */
export type CommentInput = {
  postId: string;
  authorName: string;
  authorEmail?: string;
  body: string;
  consent: boolean;
  /** Parent comment id when this is a reply (1-level threading). */
  parentId?: string;
  /** Hidden anti-spam field — must be empty for a real submission. */
  honeypot?: string;
  /** Client form-render time (ms) — a near-instant submit is a bot. */
  startedAt?: number;
};

export type CommentResult =
  { ok: true } | { ok: false; error: "invalid" | "spam" | "server" };

const MAX_NAME = 80;
const MAX_BODY = 2000;
const MAX_EMAIL = 254;
const MAX_POST_ID = 200;
const MIN_SUBMIT_MS = 2000; // a human takes >2s; a near-instant submit is a bot
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Sanity document id charset (letters, digits, `.` for drafts, `-`, `_`).
const DOC_ID = /^[A-Za-z0-9._-]+$/;

/**
 * Too-fast submit heuristic. Skew-safe: only a small POSITIVE gap counts, so a
 * client clock running ahead (negative elapsed) never false-flags a real person.
 */
function tooFast(startedAt?: number): boolean {
  if (typeof startedAt !== "number") return false;
  const elapsed = Date.now() - startedAt;
  return elapsed >= 0 && elapsed < MIN_SUBMIT_MS;
}

/** Pure validator — kept separate so it's cheap to unit-check. */
export function validateComment(input: Partial<CommentInput>): CommentResult {
  if ((input.honeypot ?? "").trim() !== "" || tooFast(input.startedAt)) {
    return { ok: false, error: "spam" };
  }
  const name = (input.authorName ?? "").trim();
  const body = (input.body ?? "").trim();
  const postId = (input.postId ?? "").trim();
  const email = input.authorEmail?.trim();
  if (!postId || postId.length > MAX_POST_ID || !DOC_ID.test(postId)) {
    return { ok: false, error: "invalid" };
  }
  if (!name || name.length > MAX_NAME) return { ok: false, error: "invalid" };
  if (!body || body.length > MAX_BODY) return { ok: false, error: "invalid" };
  if (email && (email.length > MAX_EMAIL || !EMAIL.test(email))) {
    return { ok: false, error: "invalid" };
  }
  if (input.consent !== true) return { ok: false, error: "invalid" };
  return { ok: true };
}

export async function createComment(
  input: CommentInput,
  createdAt: string,
  /** Privacy-policy version accepted — server-derived, stamped as GDPR consent proof. */
  policyVersion?: string,
): Promise<CommentResult> {
  const valid = validateComment(input);
  if (!valid.ok) return valid;

  const email = input.authorEmail?.trim();
  try {
    // The target post must exist — a crafted `postId` can't attach a comment to
    // an arbitrary document id (it would otherwise sit unapproved against any id).
    const postExists = await writeClient.fetch<string | null>(
      `*[_type == "post" && _id == $id][0]._id`,
      { id: input.postId },
    );
    if (!postExists) return { ok: false, error: "invalid" };

    // Attach the parent only if it's an approved comment on the SAME post —
    // otherwise the reply is stored top-level (a bad `parentId` can't thread
    // onto another post or an unapproved comment).
    let parent: { _type: "reference"; _ref: string } | undefined;
    if (input.parentId) {
      const ok = await writeClient.fetch<string | null>(
        `*[_type == "comment" && _id == $id && approved == true][0].post._ref`,
        { id: input.parentId },
      );
      if (ok === input.postId)
        parent = { _type: "reference", _ref: input.parentId };
    }

    // One-time token for the email moderation buttons (approve / spam / delete).
    const moderationToken = crypto.randomUUID();

    await writeClient.create({
      _type: "comment", // hard-coded — never from the request
      approved: false,
      authorName: input.authorName.trim().slice(0, MAX_NAME),
      ...(email ? { authorEmail: email.slice(0, MAX_EMAIL) } : {}),
      body: input.body.trim().slice(0, MAX_BODY),
      post: { _type: "reference", _ref: input.postId },
      ...(parent ? { parent } : {}),
      consent: true,
      ...(policyVersion
        ? { consentPolicyVersion: policyVersion.slice(0, 120) }
        : {}),
      createdAt,
      moderationToken,
    });
    // Best-effort owner alert — `notifyNewComment` never throws, so a mail
    // failure can't turn an already-saved comment into a 500.
    await notifyNewComment(input, moderationToken);
    return { ok: true };
  } catch (error) {
    logger.error("comment create failed", { postId: input.postId, error });
    return { ok: false, error: "server" };
  }
}
