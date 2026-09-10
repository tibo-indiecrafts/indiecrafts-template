import { defaultLocale } from "@indiecrafts/packages-shared-config";
import type { MailEnv } from "../erasure/email";
import type { AuthCopy } from "./templates";

/** A `localeString`/`localeText` field as stored in Sanity — `{ en, fr }` (or a plain string). */
type LocaleValue =
  Record<string, string | undefined> | string | null | undefined;

type AuthGroup = {
  enabled?: boolean;
  subject?: LocaleValue;
  intro?: LocaleValue;
  buttonLabel?: LocaleValue;
  outro?: LocaleValue;
};

/** The four Studio-editable auth-email groups on the `emailStrings` singleton. */
export type AuthEmailStrings = {
  authVerification?: AuthGroup;
  authResetPassword?: AuthGroup;
  authMagicLink?: AuthGroup;
  authNewDevice?: AuthGroup;
};

/** Our four auth-email kinds — the canonical id behind Clerk's (varying) slugs. */
export type AuthKind = "verification" | "reset" | "magic" | "newDevice";

const GROUP_FOR_KIND: Record<AuthKind, keyof AuthEmailStrings> = {
  verification: "authVerification",
  reset: "authResetPassword",
  magic: "authMagicLink",
  newDevice: "authNewDevice",
};

/** The template slug our renderer + Studio group are keyed by, per kind. */
const SLUG_FOR_KIND: Record<AuthKind, string> = {
  verification: "verification_code",
  reset: "reset_password_code",
  magic: "magic_link_sign_in",
  newDevice: "sign_in_from_new_device",
};

/**
 * Map a Clerk email `slug` → our auth kind, FORGIVINGLY. Clerk's exact slugs vary and the
 * new-device one is undocumented, so we match by substring rather than an exact allow-list:
 * any slug containing "verification" → verification, "reset"/"password" → reset, "magic" →
 * magic link, "device" → new device. Returns `null` for a non-auth slug (the handler then
 * forwards Clerk's own rendered body untouched).
 */
export function authKind(slug: string): AuthKind | null {
  const s = slug.toLowerCase();
  if (s.includes("verification")) return "verification";
  if (s.includes("reset") || s.includes("password")) return "reset";
  if (s.includes("magic")) return "magic";
  if (s.includes("device")) return "newDevice";
  return null;
}

/** The canonical template slug for a Clerk slug (via {@link authKind}), or undefined. */
export function canonicalAuthSlug(slug: string): string | undefined {
  const k = authKind(slug);
  return k ? SLUG_FOR_KIND[k] : undefined;
}

/** Resolve a locale field to the recipient's locale, else the default; empty → undefined. */
function pick(v: LocaleValue, locale: string): string | undefined {
  if (typeof v === "string") return v || undefined;
  if (!v) return undefined;
  return v[locale] || v[defaultLocale] || undefined;
}

/**
 * The Studio override for one auth email, resolved to the recipient's locale — or
 * `undefined` when there is no editable copy for this slug (the template then uses its
 * hardcoded en/fr). An operator toggling the group's `enabled` OFF means "ignore the
 * custom copy" → also `undefined`. Per-field: a blank field stays `undefined`, so the
 * template falls back field-by-field.
 */
export function resolveAuthCopy(
  strings: AuthEmailStrings | null,
  slug: string,
  locale: string,
): AuthCopy | undefined {
  const kind = authKind(slug);
  if (!strings || !kind) return undefined;
  const g = strings[GROUP_FOR_KIND[kind]];
  if (!g || g.enabled === false) return undefined;
  return {
    subject: pick(g.subject, locale),
    intro: pick(g.intro, locale),
    buttonLabel: pick(g.buttonLabel, locale),
    outro: pick(g.outro, locale),
  };
}

/**
 * A 5-minute in-worker cache of the auth read. Auth emails fire on every sign-in, so the
 * same singleton would otherwise be re-fetched constantly; a worker isolate lives long
 * enough for this to pay off. Only the real `fetch` path is cached — an injected `doFetch`
 * (tests) always hits the network stub, so caching never leaks between test cases.
 */
let authCache: { at: number; value: AuthEmailStrings | null } | undefined;
const AUTH_CACHE_MS = 5 * 60_000;

/**
 * Fetch the auth-email copy from the Studio `emailStrings` singleton (raw GROQ-over-HTTP,
 * mirroring `erasure/email.ts` — the same already-declared Sanity env vars, no new deps).
 * MUST NOT throw: an unset/unreachable Sanity resolves to `null` and the templates fall
 * back to their hardcoded copy, so a missing Studio never blocks a mandatory auth email.
 * `doFetch` is injectable for tests (and bypasses the cache).
 */
export async function fetchAuthEmailStrings(
  env: MailEnv,
  doFetch: typeof fetch = fetch,
): Promise<AuthEmailStrings | null> {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) return null;
  const cacheable = doFetch === fetch;
  if (cacheable && authCache && Date.now() - authCache.at < AUTH_CACHE_MS) {
    return authCache.value;
  }
  try {
    const version = env.SANITY_API_VERSION || "2025-01-01";
    const token = env.SANITY_API_READ_TOKEN;
    const host = token
      ? `${env.SANITY_PROJECT_ID}.api.sanity.io`
      : `${env.SANITY_PROJECT_ID}.apicdn.sanity.io`;
    const query =
      '*[_type=="emailStrings"][0]{ authVerification{enabled,subject,intro,outro}, authResetPassword{enabled,subject,intro,outro}, authMagicLink{enabled,subject,intro,buttonLabel,outro}, authNewDevice{enabled,subject,intro,buttonLabel,outro} }';
    const endpoint = `https://${host}/v${version}/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const res = await doFetch(
      endpoint,
      token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { result?: AuthEmailStrings };
    const value = body.result ?? null;
    if (cacheable) authCache = { at: Date.now(), value };
    return value;
  } catch {
    return null;
  }
}
