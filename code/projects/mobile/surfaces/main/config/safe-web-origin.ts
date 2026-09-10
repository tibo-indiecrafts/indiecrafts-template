/**
 * HTTPS-only origin guard for the web hand-offs (account page, legal link-out) and the
 * version poll. A non-TLS origin returns `undefined` so the caller fails closed (button
 * hidden, no poll) instead of opening an insecure page — the env origins are build
 * constants, so this catches a misbuilt release, not a runtime attack. `http://localhost`
 * stays allowed for the local dev web stack.
 * ponytail: scheme + localhost check only; tighten to a host allowlist if a build needs it.
 */
export function safeWebOrigin(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("https://") || url.startsWith("http://localhost"))
    return url;
  return undefined;
}
