/**
 * Tell a newsletter sign-up from a lead-magnet-only one.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/purpose.md
 */

/** The `source` the lead-magnet block posts. Its consent covers the document, not the
 *  newsletter, so such a request never adds newsletter consent. */
export const LEAD_MAGNET_SOURCE = "lead-magnet";

/** Newsletter consent of a stored subscriber. A doc saved before the `newsletter` field
 *  existed counts as a newsletter sign-up unless it came from a lead magnet. */
export function wantsNewsletter(doc: {
  newsletter?: boolean | null;
  source?: string | null;
}): boolean {
  return doc.newsletter ?? doc.source !== LEAD_MAGNET_SOURCE;
}
