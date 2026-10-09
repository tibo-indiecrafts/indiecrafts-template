/**
 * The guarded submit every public form shares: status, anti-bot fields, consent, the POST.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/useGuardedSubmit.md
 */
// A client hook (no "use client" entry: only the client forms import it).
import { useId, useState } from "react";
import { useLocale } from "next-intl";
import { turnstileActive } from "./TurnstileWidget";

/**
 * The guarded submit every form shares. `submit(fields)` POSTs the form's own fields plus
 * what the server's `withGuard` + anti-spam checks read: `consent`, the page `language`,
 * the `honeypot`, `startedAt` (a near-instant submit is a bot) and the Turnstile token.
 * `201` → success; anything else → error, and the Turnstile widget resets for a retry.
 */
export function useGuardedSubmit(endpoint: string) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [tokenKey, setTokenKey] = useState(0); // bump to reset the Turnstile widget
  const [startedAt] = useState(() => Date.now());
  const language = useLocale(); // the confirm email + stored `language` match the visitor
  const uid = useId();

  function fail() {
    setStatus("error");
    setToken(null);
    setTokenKey((k) => k + 1);
  }

  async function submit(fields: Record<string, unknown>) {
    setStatus("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: window.location.pathname,
          ...fields,
          consent,
          language,
          honeypot,
          startedAt,
          ...(token ? { "cf-turnstile-response": token } : {}),
        }),
      });
      if (res.status === 201) setStatus("success");
      else fail();
    } catch {
      fail();
    }
  }

  return {
    uid,
    status,
    consent,
    setConsent,
    honeypot,
    setHoneypot,
    setToken,
    tokenKey,
    submit,
    /** Submit stays disabled until consent is ticked and Turnstile (when active) answered. */
    canSubmit:
      status !== "submitting" && consent && (!turnstileActive() || !!token),
  };
}

export type GuardedSubmit = ReturnType<typeof useGuardedSubmit>;
