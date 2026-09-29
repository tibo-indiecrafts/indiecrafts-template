/**
 * The legal-route contract — one source of truth for the canonical legal pages, so
 * a shell (Expo · the `app` web surface) can link OUT to the website's
 * legal pages, and the website's own `pages.ts` reads the same slugs. Plus the legal
 * re-acceptance shape (`LegalAcceptanceRecord` + `needsReacceptance`), used by every
 * shell over its own store adapter.
 *
 * No re-hosting: the shells open these URLs on the website (`legalUrl`), where the
 * content stays Sanity-driven.
 */

import {
  defaultLocale,
  localizedPathname,
  type Locale,
} from "@indiecrafts/packages-shared-config/shared";

/**
 * The compliance routes — the 5 legal pages + the GDPR data-request form — with
 * their per-locale slugs (French primary). `as const` so the literal `key`/`id`/`slug`
 * survive being spread into the website's `pages` map (which derives its typed route
 * union from the literal `key`s).
 */
export const LEGAL_PAGES = {
  legalNotice: {
    key: "/legal-notice",
    id: "legal-notice",
    slug: { en: "/legal-notice", fr: "/mentions-legales" },
  },
  privacy: {
    key: "/privacy-policy",
    id: "privacy",
    slug: { en: "/privacy-policy", fr: "/politique-de-confidentialite" },
  },
  cookies: {
    key: "/cookie-policy",
    id: "cookies",
    slug: { en: "/cookie-policy", fr: "/politique-de-cookies" },
  },
  terms: {
    key: "/terms",
    id: "terms",
    slug: { en: "/terms", fr: "/conditions-generales-utilisation" },
  },
  termsOfSale: {
    key: "/terms-of-sale",
    id: "terms-of-sale",
    slug: { en: "/terms-of-sale", fr: "/conditions-generales-de-vente" },
  },
  dataRequest: {
    key: "/data-request",
    id: "data-request",
    slug: { en: "/data-request", fr: "/exercer-mes-droits" },
  },
} as const;

export type LegalPageKey = keyof typeof LEGAL_PAGES;

/** The 5 legal pages (excludes the data-request form) — the usual link-out list. */
export const LEGAL_PAGE_KEYS = [
  "legalNotice",
  "privacy",
  "cookies",
  "terms",
  "termsOfSale",
] as const satisfies readonly LegalPageKey[];

/**
 * The absolute URL of a legal page on the website. `baseUrl` is the marketing site
 * origin (`site.websiteUrl`); the per-locale slug + `localizedPathname` mirror the
 * website's `as-needed` prefix policy (default locale unprefixed, others `/<code>`),
 * so the URL matches the live route. Falls back to the default-locale slug for a
 * locale that has no legal slug yet.
 */
export function legalUrl(
  baseUrl: string,
  key: LegalPageKey,
  locale: Locale,
): string {
  const slug = LEGAL_PAGES[key].slug as Partial<Record<Locale, `/${string}`>>;
  const path = slug[locale] ?? slug[defaultLocale] ?? "/";
  return `${baseUrl.replace(/\/+$/, "")}${localizedPathname(path, locale)}`;
}

/** A shell's record of the legal-policy version the visitor accepted, and when. */
export type LegalAcceptanceRecord = {
  version: string;
  t: number;
};

/** The injected copy for the re-acceptance prompt — resolved per shell from `messages`. */
export type LegalReacceptanceCopy = {
  title: string;
  body: string;
  acceptLabel: string;
};

/** A policy link woven into the re-acceptance message (label + href). */
export type LegalReacceptanceLink = { label: string; href: string };

/** A parsed message segment — plain text, or a link to render inline. */
export type LegalMessagePart = string | LegalReacceptanceLink;

/**
 * Split a re-acceptance `message` into inline text + link parts. Each `[[…]]` marker
 * becomes a link whose LABEL is the text inside the brackets and whose HREF is the next
 * entry of `hrefs`, in order — so the message authors the sentence ("We updated our
 * [[Privacy Policy]] and [[Terms]].") and the shell supplies the two URLs (privacy,
 * terms). A marker with no matching href falls back to its plain label, so a missing
 * link never leaves a raw `[[…]]` on screen. Pure — rendered per platform by each prompt.
 */
export function linkifyMessage(
  message: string,
  hrefs: readonly string[],
): LegalMessagePart[] {
  const parts: LegalMessagePart[] = [];
  const re = /\[\[([^\]]+)\]\]/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(message)) !== null) {
    const label = m[1] ?? "";
    if (m.index > last) parts.push(message.slice(last, m.index));
    const href = hrefs[i++];
    parts.push(href ? { label, href } : label);
    last = re.lastIndex;
  }
  if (last < message.length) parts.push(message.slice(last));
  return parts;
}

/**
 * True when the visitor must (re-)accept the legal policies — no prior acceptance,
 * or the current policy `version` moved past what they acked. `current` is the
 * website's live policy version (`getConsentPolicyVersion`).
 */
export function needsReacceptance(
  acked: LegalAcceptanceRecord | null,
  current: string,
): boolean {
  return !acked || acked.version !== current;
}

/**
 * The website route that exposes the effective legal version — the SAME string the
 * website banner computes (`getLegalAcceptance(...).version`). App + mobile fetch it so
 * every surface re-prompts on ONE Sanity bump, and all three compare the SAME version
 * string (a per-surface static `policyVersion` would never match the website's).
 */
export const LEGAL_VERSION_ENDPOINT = "/api/legal-version";

/**
 * Fetch the website's live legal version so every surface shares one version string.
 * `websiteBaseUrl` is the marketing origin (`site.websiteUrl`). Returns null on any
 * failure — the caller falls back to its static `policyVersion`, so an unreachable
 * website never blocks the shell nor falsely re-prompts.
 */
export async function fetchLegalVersion(
  websiteBaseUrl: string,
): Promise<string | null> {
  if (!websiteBaseUrl) return null;
  try {
    const res = await fetch(
      `${websiteBaseUrl.replace(/\/+$/, "")}${LEGAL_VERSION_ENDPOINT}`,
    );
    if (res.status !== 200) return null;
    const body = (await res.json()) as { version?: unknown };
    return typeof body.version === "string" && body.version
      ? body.version
      : null;
  } catch {
    return null;
  }
}

/**
 * Read the SIGNED-IN user's server-recorded accepted legal version (`GET
 * /v1/consent/legal`). Returns null when signed out, unconfigured, or on error — the
 * caller then falls back to its per-surface local deposit. This server record is what
 * makes acceptance follow a user across website · app · mobile.
 */
export async function readLegalConsent(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
}): Promise<string | null> {
  if (!input.apiUrl) return null;
  try {
    const token = await input.getToken();
    if (!token) return null;
    const res = await fetch(`${input.apiUrl}/v1/consent/legal`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.status !== 200) return null;
    const body = (await res.json()) as { legal_acked_version?: unknown };
    return typeof body.legal_acked_version === "string"
      ? body.legal_acked_version
      : null;
  } catch {
    return null;
  }
}

/**
 * Record the accepted legal `version` for the SIGNED-IN user (`POST /v1/consent/legal`),
 * so the banner clears on their other surfaces. Best-effort: returns false on any
 * failure — the local deposit already hid the banner here. `surface` tags the proof row.
 */
export async function writeLegalConsent(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
  version: string;
  surface: string;
}): Promise<boolean> {
  if (!input.apiUrl) return false;
  try {
    const token = await input.getToken();
    if (!token) return false;
    const res = await fetch(`${input.apiUrl}/v1/consent/legal`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ version: input.version, surface: input.surface }),
    });
    return res.status === 200;
  } catch {
    return false;
  }
}
