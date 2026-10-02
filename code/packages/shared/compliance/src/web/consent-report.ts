/**
 * Reports the visitor's cookie consent choices to the server as consent events.
 *
 * @see docs/reference/packages/shared/compliance/src/web/consent-report.md
 */

// Map a stored consent choice-set to consent_events rows and report it to the
// server. The category→consent_type map is the single source of truth for which
// cookie categories are logged. reportConsent is browser-only and
// fire-and-forget: a failed POST never blocks the local Consent-Mode write.

/** Cookie category key → the consent_events consent_type. `necessary` is required
 *  and never logged; unknown keys are ignored. */
const CATEGORY_CONSENT_TYPE: Record<string, string> = {
  analytics: "cookie_analytics",
  marketing: "cookie_marketing",
};

export function consentEvents(
  choices: Record<string, boolean>,
): Array<{ type: string; granted: boolean }> {
  return Object.entries(CATEGORY_CONSENT_TYPE)
    .filter(([category]) => category in choices)
    .map(([category, type]) => ({ type, granted: !!choices[category] }));
}

export function reportConsent(
  choices: Record<string, boolean>,
  version: string,
  source = "banner",
): void {
  if (typeof window === "undefined") return;
  const events = consentEvents(choices);
  if (events.length === 0) return;
  try {
    void fetch("/api/consent-log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        events,
        version,
        source,
        decisionId: crypto.randomUUID(),
      }),
    }).catch(() => {
      // fire-and-forget: the local decision is already persisted
    });
  } catch {
    // e.g. crypto.randomUUID() throws in a non-secure context — the local
    // decision (written before this call) is already persisted
  }
}
