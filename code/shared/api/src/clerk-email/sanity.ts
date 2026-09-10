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

/** Clerk email `slug` → the `emailStrings` group that overrides it. Two slugs each map to
 *  the magic-link and new-device groups (the undocumented Clerk slug is registered twice). */
const SLUG_TO_GROUP: Record<string, keyof AuthEmailStrings> = {
  verification_code: "authVerification",
  reset_password_code: "authResetPassword",
  magic_link_sign_in: "authMagicLink",
  magic_link_sign_up: "authMagicLink",
  sign_in_from_new_device: "authNewDevice",
  new_device_sign_in: "authNewDevice",
};

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
  if (!strings) return undefined;
  const key = SLUG_TO_GROUP[slug];
  if (!key) return undefined;
  const g = strings[key];
  if (!g || g.enabled === false) return undefined;
  return {
    subject: pick(g.subject, locale),
    intro: pick(g.intro, locale),
    buttonLabel: pick(g.buttonLabel, locale),
    outro: pick(g.outro, locale),
  };
}

/**
 * Fetch the auth-email copy from the Studio `emailStrings` singleton (raw GROQ-over-HTTP,
 * mirroring `erasure/email.ts` — the same already-declared Sanity env vars, no new deps).
 * MUST NOT throw: an unset/unreachable Sanity resolves to `null` and the templates fall
 * back to their hardcoded copy, so a missing Studio never blocks a mandatory auth email.
 * `doFetch` is injectable for tests.
 */
export async function fetchAuthEmailStrings(
  env: MailEnv,
  doFetch: typeof fetch = fetch,
): Promise<AuthEmailStrings | null> {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) return null;
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
    return body.result ?? null;
  } catch {
    return null;
  }
}
