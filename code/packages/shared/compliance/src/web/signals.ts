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
