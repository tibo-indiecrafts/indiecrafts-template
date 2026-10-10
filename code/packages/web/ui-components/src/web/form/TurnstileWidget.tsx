"use client";

/**
 * Renders the Cloudflare Turnstile challenge and reports the solved token.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/TurnstileWidget.md
 */

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget — the client half of the server-side `verifyTurnstile`
 * (`@indiecrafts/packages-shared-security/turnstile`). Renders ONLY when a public site key is set
 * (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`); otherwise it renders nothing and the form
 * submits exactly as before (the server verify no-ops without the secret too).
 *
 * The public site key is inlined at build (client-safe). The secret never leaves
 * the server. Loads the Turnstile script once; CSP already allows
 * `challenges.cloudflare.com` (`@indiecrafts/packages-shared-security` csp). Reports the solved
 * token via `onToken`; on expiry/error it clears the token so the form re-blocks.
 * Remount (a changing `key`) resets the challenge after a failed submit.
 */

const ENV_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/** True when the Turnstile widget will render (public key present) — client-safe. */
export function turnstileActive(): boolean {
  return Boolean(ENV_SITE_KEY);
}

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  onToken,
  siteKey = ENV_SITE_KEY,
}: {
  onToken: (token: string | null) => void;
  /**
   * Override the public site key. Defaults to `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
   * Storybook/tests pass a Cloudflare test key (e.g. `1x0000…AA` always passes).
   */
  siteKey?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || idRef.current || !ref.current || !window.turnstile)
        return;
      idRef.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener("load", render, { once: true });
      } else {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", render, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (idRef.current && window.turnstile) {
        window.turnstile.remove(idRef.current);
        idRef.current = null;
      }
    };
  }, [onToken, siteKey]);

  if (!siteKey) return null;
  return (
    <div ref={ref} className="mt-1 flex justify-center @md:justify-start" />
  );
}
