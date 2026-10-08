/**
 * Builds the id for a document that holds personal or operator data.
 *
 * @see docs/reference/packages/web/sanity/src/private-id.md
 */

/** The id prefix that hides a document from anonymous reads. */
export const PRIVATE_PREFIX = "private.";

/**
 * A new id for a document that holds personal or operator data:
 * `private.<type>.<uuid>`.
 *
 * Sanity's free plan has public datasets only: anyone can read a document
 * without a token, unless its id contains a dot. Every runtime write of
 * personal data (a contact message, a waitlist entry, a comment) takes its
 * `_id` from here — a random id from `client.create()` has no dot and is public.
 * Server reads use a token, so they still see the document.
 */
export function privateId(type: string): string {
  return `${PRIVATE_PREFIX}${type}.${crypto.randomUUID()}`;
}
