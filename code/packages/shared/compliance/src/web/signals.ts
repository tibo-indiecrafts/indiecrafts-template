/**
 * Browser opt-out signals (DOM). `Global Privacy Control` is legally enforceable under
 * CCPA/CPRA; `Do-Not-Track` is honoured as courtesy. Used by the shells to seed a reject
 * default when a visitor's browser already signals opt-out — so opt-out/none regions still
 * respect the signal, matching what the website's own `CookieBanner` already does. No RN
 * equivalent exists, so the native fork has no counterpart (documented there).
 */
export function browserSignalsDeny(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

/**
 * Union of the server-detected `Sec-GPC: 1` request header (read in the shell's
 * `[locale]/layout.tsx` via `headers()`) and `browserSignalsDeny()` — either source denies.
 * Reading the header server-side means the initial consent seed already honours GPC before
 * any client JS runs; the client check still runs too, since a proxy/CDN can strip the header
 * even when the browser sets `navigator.globalPrivacyControl`, and vice versa.
 */
export function signalsDeny(gpcSignal: boolean): boolean {
  return gpcSignal || browserSignalsDeny();
}
