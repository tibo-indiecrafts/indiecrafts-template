import { pickLocale } from "@indiecrafts/packages-shared-config";
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

/** Our Clerk email kinds — the canonical id behind Clerk's (varying) slugs. Each is also
 *  the group name on the `clerkEmails` Studio singleton (identity map, no lookup table). */
export type AuthKind =
  | "verification"
  | "resetPassword"
  | "magicLink"
  | "newDevice"
  | "passwordChanged"
  | "passwordRemoved"
  | "passkeyAdded"
  | "passkeyRemoved"
  | "mfaEnabled"
  | "primaryEmailChanged"
  | "accountLocked"
  | "invitation";

/** The editable groups on the `clerkEmails` singleton (keyed by kind) + the global support
 *  address (read from the `emailStrings` singleton, shown in every footer). */
export type AuthEmailStrings = Partial<Record<AuthKind, AuthGroup>> & {
  supportEmail?: string;
  /** The global editor-owned blind-copy address (`emailStrings.bccAll`). */
  bccAll?: string;
};

/** The canonical Clerk template slug per kind — matches `AUTH_TEMPLATES` keys + the real
 *  Clerk slugs (verified via the Clerk CLI `templates/email` list). */
const SLUG_FOR_KIND: Record<AuthKind, string> = {
  verification: "verification_code",
  resetPassword: "reset_password_code",
  magicLink: "magic_link_sign_in",
  newDevice: "new_device_sign_in",
  passwordChanged: "password_changed",
  passwordRemoved: "password_removed",
  passkeyAdded: "passkey_added",
  passkeyRemoved: "passkey_removed",
  mfaEnabled: "mfa_enabled",
  primaryEmailChanged: "primary_email_address_changed",
  accountLocked: "account_locked",
  invitation: "invitation",
};

/**
 * Map a Clerk email `slug` → our kind, FORGIVINGLY (Clerk's exact slugs vary). Order
 * matters: `reset` before `password` (reset_password_code contains "password"); `passkey`
 * before `password`. Returns `null` for a slug we don't localize (the handler forwards
 * Clerk's own rendered body untouched, still wrapped in our shell).
 */
export function authKind(slug: string): AuthKind | null {
  const s = slug.toLowerCase();
  if (s.includes("verification")) return "verification";
  if (s.includes("reset")) return "resetPassword";
  if (s.includes("magic")) return "magicLink";
  if (s.includes("device")) return "newDevice";
  if (s.includes("passkey"))
    return s.includes("remov") ? "passkeyRemoved" : "passkeyAdded";
  if (s.includes("password"))
    return s.includes("remov") ? "passwordRemoved" : "passwordChanged";
  if (s.includes("mfa") || s.includes("two_step") || s.includes("two-step"))
    return "mfaEnabled";
  if (s.includes("primary_email") || s.includes("primary email"))
    return "primaryEmailChanged";
  if (s.includes("locked")) return "accountLocked";
  if (s.includes("invit")) return "invitation";
  return null;
}

/** The canonical template slug for a Clerk slug (via {@link authKind}), or undefined. */
export function canonicalAuthSlug(slug: string): string | undefined {
  const k = authKind(slug);
  return k ? SLUG_FOR_KIND[k] : undefined;
}

/** Resolve a locale field to the recipient's locale, else the default; empty → undefined
 *  (so a blank Studio field falls through to the template's hardcoded copy). */
function pick(v: LocaleValue, locale: string): string | undefined {
  return pickLocale(v, locale) || undefined;
}

/**
 * The Studio override for one Clerk email, resolved to the recipient's locale — or
 * `undefined` when there is no editable copy for this slug (the template then uses its
 * hardcoded en/fr). `enabled === false` means "ignore the custom copy" → also `undefined`.
 * Per-field: a blank field stays `undefined`, so the template falls back field-by-field.
 */
export function resolveAuthCopy(
  strings: AuthEmailStrings | null,
  slug: string,
  locale: string,
): AuthCopy | undefined {
  const kind = authKind(slug);
  if (!strings || !kind) return undefined;
  const g = strings[kind];
  if (!g || g.enabled === false) return undefined;
  return {
    subject: pick(g.subject, locale),
    intro: pick(g.intro, locale),
    buttonLabel: pick(g.buttonLabel, locale),
    outro: pick(g.outro, locale),
  };
}

/** A 5-minute in-worker cache of the read. Auth emails fire on every sign-in, so the same
 *  singletons would otherwise be re-fetched constantly; a worker isolate lives long enough
 *  to pay off. Only the real `fetch` path is cached — an injected `doFetch` (tests) always
 *  hits the network stub, so caching never leaks between test cases. */
let authCache: { at: number; value: AuthEmailStrings | null } | undefined;
const AUTH_CACHE_MS = 5 * 60_000;

/** GROQ: the 12 `clerkEmails` groups + the global `emailStrings.supportEmail`, in one call. */
const CLERK_GROUPS =
  "verification,resetPassword,magicLink,newDevice,passwordChanged,passwordRemoved,passkeyAdded,passkeyRemoved,mfaEnabled,primaryEmailChanged,accountLocked,invitation";
const QUERY = `{"clerk":*[_type=="clerkEmails"][0]{${CLERK_GROUPS}},"supportEmail":*[_type=="emailStrings"][0].supportEmail,"bccAll":*[_type=="emailStrings"][0].bccAll}`;

/**
 * Fetch the Clerk-email copy (`clerkEmails` singleton) + the global support address
 * (`emailStrings.supportEmail`) via raw GROQ-over-HTTP (mirrors `erasure/email.ts` — same
 * Sanity env vars, no new deps). MUST NOT throw: an unset/unreachable Sanity resolves to
 * `null`, so the templates fall back to their hardcoded copy and the footer omits the
 * support line. `doFetch` is injectable for tests (and bypasses the cache).
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
    const endpoint = `https://${host}/v${version}/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(QUERY)}`;
    const res = await doFetch(
      endpoint,
      token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      result?: {
        clerk?: Partial<Record<AuthKind, AuthGroup>> | null;
        supportEmail?: string | null;
        bccAll?: string | null;
      };
    };
    const r = body.result;
    const value: AuthEmailStrings | null = r
      ? {
          ...(r.clerk ?? {}),
          supportEmail: r.supportEmail ?? undefined,
          bccAll: r.bccAll ?? undefined,
        }
      : null;
    if (cacheable) authCache = { at: Date.now(), value };
    return value;
  } catch {
    return null;
  }
}
