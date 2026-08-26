# Profile Locale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store each signed-in user's locale on their `user_profiles` row, let them change it from every web surface's settings page, and give emails one precedence rule so localized copy is used whenever it exists.

**Architecture:** `user_profiles.locale` already exists (dead column) — no migration. A new authenticated worker route `POST /v1/profile/locale` writes it; the session-login sink stamps it on first login (`COALESCE`, so an explicit choice is never overwritten); a pure `resolveLocale(...)` helper unifies the profile → captured → default fallback that every sender feeds into `pick()`. A Clerk-free shared `LocalePreferenceForm` renders the selector on all three web surfaces.

**Tech Stack:** Cloudflare Workers (bare, no Next) · D1 (SQLite) · Clerk JWT · TypeScript · React 19 · next-intl v4 · Vitest (`@cloudflare/vitest-pool-workers`).

**Spec:** `docs/superpowers/specs/2026-08-26-profile-locale-design.md`

## Global Constraints

- **No migration.** `user_profiles.locale TEXT` exists (`code/shared/api/db/core/migrations/0001_user_profiles.sql:16`). Wire it; do not alter the schema.
- **Auth every mutating route.** The write route verifies a Clerk session JWT; `userId` comes from the `sub` claim, never the body. Mirror `code/shared/api/src/erasure/self.ts`.
- **Never expose a write token.** D1 writes happen only in the worker. Surfaces POST to the worker with the user's Clerk JWT via `getToken()`.
- **`ui-components` must not depend on Clerk.** The shared form takes a `getToken` prop; each surface supplies `useAuth().getToken` in a thin client wrapper (mirror `AccountDeletePanel.tsx`).
- **Surfaces:** route via `@/i18n/routing`; user-facing strings live in `messages/<locale>.json` (never inline). Locales are `en` + `fr`.
- **Detect never overwrites an explicit choice:** the login upsert uses `locale = COALESCE(user_profiles.locale, excluded.locale)`.
- **Owner-alert emails stay on `defaultLocale`** — out of the precedence chain by design.
- **Writing style** (comments/commits): active voice, one idea per sentence, keep technical items exact.

---

### Task 1: Worker route `POST /v1/profile/locale` + `getProfileLocale` read hook

**Files:**
- Create: `code/shared/api/src/profile/locale.ts`
- Create: `code/shared/api/src/profile/locale.test.ts`
- Modify: `code/shared/api/src/index.ts` (register the route beside `/v1/erasure/self`, ~line 1062)

**Interfaces:**
- Consumes: `Env`, `PUBLIC_CORS_POST`, `clientIp` from `../index`; `isLocale`, `localeCodes`, `type Locale` from `@indiecrafts/packages-shared-config`.
- Produces:
  - `getProfileLocale(env: Env, userId: string): Promise<Locale | null>`
  - `handleProfileLocale(request: Request, env: Env, ctx?: ExecutionContext, authenticate?: (request: Request, env: Env) => Promise<string | null>): Promise<Response>`

- [ ] **Step 1: Write the failing test**

Create `code/shared/api/src/profile/locale.test.ts`:

```ts
import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import { handleProfileLocale, getProfileLocale } from "./locale";

const USER = "user_locale_1";

function testEnv(overrides: Partial<Env> = {}): Env {
  return { ...(env as unknown as Env), CLERK_SECRET_KEY: "sk_test", ...overrides };
}

function postJson(body: Record<string, unknown>): Request {
  return new Request("https://example.com/v1/profile/locale", {
    method: "POST",
    headers: { authorization: "Bearer tkn", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const authOk = vi.fn(async () => USER);
const authNone = vi.fn(async () => null);

describe("POST /v1/profile/locale", () => {
  it("upserts the profile locale for the authenticated user", async () => {
    const res = await handleProfileLocale(postJson({ locale: "fr" }), testEnv(), undefined, authOk);
    expect(res.status).toBe(200);
    const row = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind(USER).first<{ locale: string }>();
    expect(row?.locale).toBe("fr");
  });

  it("rejects an unsupported locale with 400", async () => {
    const res = await handleProfileLocale(postJson({ locale: "zz" }), testEnv(), undefined, authOk);
    expect(res.status).toBe(400);
  });

  it("returns 401 when the JWT does not resolve a user", async () => {
    const res = await handleProfileLocale(postJson({ locale: "fr" }), testEnv(), undefined, authNone);
    expect(res.status).toBe(401);
  });

  it("returns 503 when CORE_DB is unbound", async () => {
    const res = await handleProfileLocale(
      postJson({ locale: "fr" }),
      testEnv({ CORE_DB: undefined }),
      undefined,
      authOk,
    );
    expect(res.status).toBe(503);
  });
});

describe("getProfileLocale", () => {
  it("reads back a stored locale and returns null when absent", async () => {
    await handleProfileLocale(postJson({ locale: "en" }), testEnv(), undefined, async () => "user_read_1");
    expect(await getProfileLocale(testEnv(), "user_read_1")).toBe("en");
    expect(await getProfileLocale(testEnv(), "user_absent")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -- src/profile/locale.test.ts`
Expected: FAIL — `./locale` has no export `handleProfileLocale`.

- [ ] **Step 3: Write the implementation**

Create `code/shared/api/src/profile/locale.ts`:

```ts
// Profile locale — an AUTHENTICATED write + a read hook. A signed-in user sets the
// language stored on their user_profiles row; the Clerk session JWT proves identity
// (userId from the `sub` claim). The read hook lets a worker-sent, authenticated
// email resolve the recipient's language. Mirrors erasure/self.ts (JWT verify), but
// needs only the userId — no email round-trip, no typed-email gate (non-destructive).
import { isLocale, localeCodes, type Locale } from "@indiecrafts/packages-shared-config";
import { type Env, PUBLIC_CORS_POST, clientIp } from "../index";

const BODY_MAX = 1000;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...PUBLIC_CORS_POST },
  });
}

/** Verify the Clerk session JWT and return the caller's userId (`sub`), else null. */
async function defaultAuthenticate(request: Request, env: Env): Promise<string | null> {
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token || !env.CLERK_SECRET_KEY) return null;
  try {
    const { verifyToken } = await import("@clerk/backend");
    const { data: claims, errors } = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    if (errors || !claims) return null;
    const sub = (claims as { sub?: unknown }).sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null; // fail closed
  }
}

/** Read the stored profile locale for a user; null when absent or unrecognised. */
export async function getProfileLocale(env: Env, userId: string): Promise<Locale | null> {
  if (!env.CORE_DB) return null;
  const row = await env.CORE_DB.prepare(
    "SELECT locale FROM user_profiles WHERE user_id = ?",
  ).bind(userId).first<{ locale: string | null }>();
  const value = row?.locale ?? "";
  return value && isLocale(value, localeCodes) ? value : null;
}

export async function handleProfileLocale(
  request: Request,
  env: Env,
  _ctx?: ExecutionContext,
  authenticate: (request: Request, env: Env) => Promise<string | null> = defaultAuthenticate,
): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!env.CORE_DB || !env.CLERK_SECRET_KEY) return json({ error: "unavailable" }, 503);
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX) return json({ error: "too_large" }, 413);

  if (env.AGENT_RATELIMIT) {
    // Key on the caller IP, not the bearer token (a Clerk JWT's leading bytes are
    // shared across users). Matches /v1/erasure/self.
    const { success } = await env.AGENT_RATELIMIT.limit({ key: clientIp(request) });
    if (!success) return json({ error: "rate_limited" }, 429);
  }

  const userId = await authenticate(request, env);
  if (!userId) return json({ error: "unauthorized" }, 401);

  let locale = "";
  try {
    const body = (await request.json()) as { locale?: unknown };
    locale = String(body.locale ?? "").trim();
  } catch {
    return json({ error: "invalid" }, 400);
  }
  if (!isLocale(locale, localeCodes)) return json({ error: "invalid" }, 400);

  const now = new Date().toISOString();
  // Upsert: a signed-in user normally already has a row (session login), but insert
  // defensively so the write always lands. Explicit choice always wins (unconditional SET).
  await env.CORE_DB.prepare(
    "INSERT INTO user_profiles (user_id, created_at, locale) VALUES (?, ?, ?) " +
      "ON CONFLICT(user_id) DO UPDATE SET locale = excluded.locale",
  ).bind(userId, now, locale).run();

  return json({ locale }, 200);
}
```

Register the route in `code/shared/api/src/index.ts` immediately before the `/v1/erasure/self` block (~line 1062). Add the import near the other route-handler imports at the top:

```ts
import { handleProfileLocale } from "./profile/locale";
```

```ts
    // ── Profile locale — POST /v1/profile/locale (AUTHENTICATED; Clerk JWT) ──
    // A signed-in user sets the language stored on their user_profiles row.
    if (url.pathname === "/v1/profile/locale")
      return handleProfileLocale(request, env, ctx);
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @indiecrafts/shared-api test -- src/profile/locale.test.ts`
Expected: PASS (all 6 assertions).

- [ ] **Step 5: Commit**

```bash
git add code/shared/api/src/profile/locale.ts code/shared/api/src/profile/locale.test.ts code/shared/api/src/index.ts
git commit -m "feat(api): POST /v1/profile/locale + getProfileLocale read hook"
```

---

### Task 2: Detect — stamp locale on login (COALESCE, first-login-wins)

**Files:**
- Modify: `code/packages/web/auth/src/session-log.ts` (add `locale` to the forwarded body)
- Modify: `code/packages/web/auth/src/session-logger.tsx` (accept + send a `locale` prop)
- Modify: `code/shared/api/src/index.ts` (session branch upsert, ~line 351-378)
- Modify: `code/shared/api/src/user-profiles.test.ts` (COALESCE test)
- Modify (×3): `code/projects/web/surfaces/{website,app,admin}/src/app/api/session-log/route.ts` (pass `locale`)
- Modify (×3): each surface's root layout that mounts `<SessionLogger>` (pass the active `locale`)

**Interfaces:**
- Consumes: `getProfileLocale`/route from Task 1 are unrelated here; this task consumes `isLocale`, `localeCodes` from config in the worker.
- Produces: `logSession` gains `locale?: string | null`; `<SessionLogger>` gains `locale?: string` prop.

- [ ] **Step 1: Write the failing test**

Add to `code/shared/api/src/user-profiles.test.ts`. First extend the existing `postSession` helper to accept a locale (edit its body to include `locale`), then add:

```ts
describe("login stamps locale (COALESCE, first-login wins)", () => {
  it("sets locale on first login and never overwrites it on a later login", async () => {
    await postSession("user_loc_1", "fr");
    const a = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind("user_loc_1").first<{ locale: string }>();
    expect(a?.locale).toBe("fr");

    // A later login from a different locale must NOT overwrite the stored value.
    await postSession("user_loc_1", "en");
    const b = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind("user_loc_1").first<{ locale: string }>();
    expect(b?.locale).toBe("fr");
  });

  it("ignores an unsupported locale (stores null)", async () => {
    await postSession("user_loc_2", "zz");
    const row = await env.DB.prepare(
      "SELECT locale FROM user_profiles WHERE user_id = ?",
    ).bind("user_loc_2").first<{ locale: string | null }>();
    expect(row?.locale ?? null).toBeNull();
  });
});
```

Update the existing `postSession` helper in that file to forward the locale:

```ts
async function postSession(userId: string, locale?: string) {
  return SELF.fetch("https://example.com/v1/events", {
    method: "POST",
    headers: { authorization: "Bearer test-token", "content-type": "application/json" },
    body: JSON.stringify({ kind: "session", surface: "website", userId, locale }),
  });
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -- src/user-profiles.test.ts`
Expected: FAIL — `locale` column stays null (nothing stamps it yet).

- [ ] **Step 3: Implement the worker upsert**

In `code/shared/api/src/index.ts`, add `isLocale, localeCodes` to the existing `@indiecrafts/packages-shared-config` import block (top of file, ~line 3-11). Then in the `body.kind === "session"` branch (~line 351), after reading `sessionId`, add:

```ts
          const localeRaw = str(body.locale, 16);
          const locale = localeRaw && isLocale(localeRaw, localeCodes) ? localeRaw : null;
```

Replace the existing `user_profiles` upsert (~line 373) with:

```ts
          await env.CORE_DB.prepare(
            "INSERT INTO user_profiles (user_id, created_at, last_login_at, locale) VALUES (?, ?, ?, ?) " +
              "ON CONFLICT(user_id) DO UPDATE SET last_login_at = excluded.last_login_at, " +
              "locale = COALESCE(user_profiles.locale, excluded.locale)",
          )
            .bind(userId, ts, ts, locale)
            .run();
```

- [ ] **Step 4: Run the worker test to verify it passes**

Run: `pnpm --filter @indiecrafts/shared-api test -- src/user-profiles.test.ts`
Expected: PASS.

- [ ] **Step 5: Thread locale through the client chain**

`code/packages/web/auth/src/session-log.ts` — add `locale` to the input type and the forwarded body:

```ts
export async function logSession(input: {
  surface: string;
  userId: string;
  sessionId?: string | null;
  country?: string | null;
  locale?: string | null;
}): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return;
  try {
    await fetch(`${url}/v1/events`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        kind: "session",
        surface: input.surface.slice(0, 16),
        userId: input.userId,
        sessionId: input.sessionId ?? undefined,
        country: input.country ?? undefined,
        locale: input.locale ?? undefined,
      }),
    });
  } catch {
    // fire-and-forget
  }
}
```

`code/packages/web/auth/src/session-logger.tsx` — accept a `locale` prop and send it (no new dependency; the surface passes its active locale):

```tsx
export function SessionLogger({ surface, locale }: { surface: string; locale?: string }) {
  const { isSignedIn, sessionId } = useAuth();
  useEffect(() => {
    if (!isSignedIn || !sessionId) return;
    const key = `session-logged:${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return;
    }
    void fetch("/api/session-log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ surface, locale }),
    });
  }, [isSignedIn, sessionId, surface, locale]);
  return null;
}
```

Each surface's `src/app/api/session-log/route.ts` — read `body.locale` and pass it to `logSession`. The current handler reads `{ surface }`; extend it:

```ts
  const body = (await request.json().catch(() => ({}))) as {
    surface?: unknown;
    locale?: unknown;
  };
  const surface = typeof body.surface === "string" ? body.surface : "web";
  const locale = typeof body.locale === "string" ? body.locale : null;
  await logSession({
    surface,
    userId,
    sessionId,
    country: request.headers.get("cf-ipcountry"),
    locale,
  });
```

In each surface's root layout where `<SessionLogger surface="…" />` is mounted, pass the active locale — e.g. `<SessionLogger surface="app" locale={locale} />` (the layout already resolves `locale` from its route params).

- [ ] **Step 6: Type-check the auth package and surfaces**

Run: `pnpm --filter @indiecrafts/packages-web-auth tsc`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add code/packages/web/auth/src/session-log.ts code/packages/web/auth/src/session-logger.tsx code/shared/api/src/index.ts code/shared/api/src/user-profiles.test.ts code/projects/web/surfaces/*/src/app/api/session-log/route.ts code/projects/web/surfaces/*/src/app/**/layout.tsx
git commit -m "feat(auth): stamp user_profiles.locale on login (COALESCE, first-login wins)"
```

---

### Task 3: `resolveLocale` precedence helper + route every sender through it

**Files:**
- Modify: `code/packages/shared/config/src/shared/i18n.ts` (add `resolveLocale`)
- Create: `code/packages/shared/config/src/shared/resolve-locale.test.ts`
- Modify: `code/modules/web/newsletter/src/lib/newsletter.ts:163-164`
- Modify: `code/modules/web/newsletter/src/lib/deliver-magnet.ts:127`
- Modify: `code/modules/web/waitlist/src/lib/waitlist.ts:132`
- Modify: `code/modules/web/contact/src/lib/contact.ts` (the confirmation `locale` line)

**Interfaces:**
- Produces: `resolveLocale(...candidates: (string | null | undefined)[]): Locale` — the first candidate that `isLocale` accepts, else `defaultLocale`. Pure, worker-safe (no `server-only`), so both worker email sends and Next senders import it.
- Consumes: existing `isLocale`, `localeCodes`, `defaultLocale` in the same file.

- [ ] **Step 1: Write the failing test**

Create `code/packages/shared/config/src/shared/resolve-locale.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveLocale } from "./i18n";
import { defaultLocale } from "./i18n";

describe("resolveLocale", () => {
  it("returns the first supported candidate", () => {
    expect(resolveLocale("fr", "en")).toBe("fr");
  });
  it("skips unsupported / empty candidates", () => {
    expect(resolveLocale(undefined, "zz", "en")).toBe("en");
  });
  it("falls back to the default locale when none is supported", () => {
    expect(resolveLocale(null, "zz")).toBe(defaultLocale);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-shared-config test -- src/shared/resolve-locale.test.ts`
Expected: FAIL — `resolveLocale` is not exported.

- [ ] **Step 3: Implement `resolveLocale`**

Add to `code/packages/shared/config/src/shared/i18n.ts` (after `isLocale`):

```ts
/**
 * Resolve one locale from an ordered list of candidates: the first that is supported
 * wins, else the default. The email recipient-locale rule — profile, then captured,
 * then default — is `resolveLocale(profileLocale, capturedLocale)`.
 */
export function resolveLocale(...candidates: (string | null | undefined)[]): Locale {
  for (const c of candidates) {
    if (c && isLocale(c, localeCodes)) return c;
  }
  return defaultLocale;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @indiecrafts/packages-shared-config test -- src/shared/resolve-locale.test.ts`
Expected: PASS.

- [ ] **Step 5: Route the senders through it (behavior-preserving)**

Replace the inline locale resolution in each sender. The change is identical everywhere: `language && isLocale(language, localeCodes) ? language : defaultLocale` (or `language || defaultLocale`) becomes `resolveLocale(language)`.

`code/modules/web/newsletter/src/lib/newsletter.ts` (~line 163) — replace:

```ts
    const locale =
      language && isLocale(language, localeCodes) ? language : defaultLocale;
```

with:

```ts
    const locale = resolveLocale(language);
```

Add `resolveLocale` to that file's `@indiecrafts/packages-shared-config` import, and drop now-unused `isLocale`/`localeCodes` imports there only if nothing else in the file uses them (the subscribe path still validates `input.language` with `isLocale` — keep it if so).

`code/modules/web/waitlist/src/lib/waitlist.ts:132` — replace `const locale = language || defaultLocale;` with `const locale = resolveLocale(language);`.

`code/modules/web/newsletter/src/lib/deliver-magnet.ts:127` — replace `const locale = language || defaultLocale;` with `const locale = resolveLocale(language);`.

`code/modules/web/contact/src/lib/contact.ts` — replace the confirmation `locale` line with `const locale = resolveLocale(language);` (match the variable name in that file).

> **Note for the future authenticated-user email (worker-sent):** resolve the recipient locale as `resolveLocale(await getProfileLocale(env, userId), capturedLocale)`, then pass it to `pick(copy, locale)`. No such sender exists today, so this task ships only the helper + the seam; do not create a sender.

- [ ] **Step 6: Run the affected module tests**

Run: `pnpm --filter @indiecrafts/modules-web-newsletter test && pnpm --filter @indiecrafts/modules-web-waitlist test && pnpm --filter @indiecrafts/modules-web-contact test`
Expected: PASS — behavior is unchanged; the senders still resolve the same locale.

- [ ] **Step 7: Commit**

```bash
git add code/packages/shared/config/src/shared/i18n.ts code/packages/shared/config/src/shared/resolve-locale.test.ts code/modules/web/newsletter/src/lib/newsletter.ts code/modules/web/newsletter/src/lib/deliver-magnet.ts code/modules/web/waitlist/src/lib/waitlist.ts code/modules/web/contact/src/lib/contact.ts
git commit -m "feat(config): resolveLocale precedence helper; route all email senders through it"
```

---

### Task 4: Shared `LocalePreferenceForm` component (Clerk-free)

**Files:**
- Create: `code/packages/web/ui-components/src/web/form/LocalePreferenceForm.tsx`
- Create: `code/packages/web/ui-components/src/web/form/LocalePreferenceForm.test.tsx`
- Modify: the package's barrel/export map so the form is importable (mirror how `NewsletterForm` is exported)

**Interfaces:**
- Produces:
  - `type LocalePreferenceCopy = { heading: string; description: string; label: string; save: string; pending: string; success: string; error: string }`
  - `LocalePreferenceForm(props: { apiUrl: string; currentLocale: string; locales: readonly { code: string; label: string }[]; copy: LocalePreferenceCopy; getToken: () => Promise<string | null> }): JSX.Element`
- Consumes: nothing from earlier tasks at build time; at runtime it POSTs to the Task 1 route.

- [ ] **Step 1: Write the failing test**

Create `code/packages/web/ui-components/src/web/form/LocalePreferenceForm.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { LocalePreferenceForm } from "./LocalePreferenceForm";

const copy = {
  heading: "Language", description: "Pick your language.", label: "Language",
  save: "Save", pending: "Saving…", success: "Saved", error: "Something went wrong",
};
const locales = [{ code: "en", label: "English" }, { code: "fr", label: "Français" }] as const;

afterEach(() => vi.restoreAllMocks());

describe("LocalePreferenceForm", () => {
  it("POSTs the chosen locale with the bearer token and shows success", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ locale: "fr" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <LocalePreferenceForm
        apiUrl="https://api.example.com"
        currentLocale="en"
        locales={locales}
        copy={copy}
        getToken={async () => "jwt-123"}
      />,
    );

    fireEvent.change(screen.getByLabelText("Language"), { target: { value: "fr" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example.com/v1/profile/locale");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).headers).toMatchObject({ authorization: "Bearer jwt-123" });
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ locale: "fr" });
  });

  it("shows an error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    render(
      <LocalePreferenceForm apiUrl="https://api.example.com" currentLocale="en"
        locales={locales} copy={copy} getToken={async () => "jwt-123"} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByText("Something went wrong")).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-web-ui-components test -- src/web/form/LocalePreferenceForm.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component**

Create `code/packages/web/ui-components/src/web/form/LocalePreferenceForm.tsx` (match the Tailwind + status-state style of `NewsletterForm.tsx` in the same folder):

```tsx
"use client";

import { useState } from "react";

export type LocalePreferenceCopy = {
  heading: string;
  description: string;
  label: string;
  save: string;
  pending: string;
  success: string;
  error: string;
};

type Status = "idle" | "pending" | "success" | "error";

/**
 * Language selector for a signed-in user. Clerk-free: the caller passes `getToken`
 * (so this brick keeps no auth dependency) and the api origin. POSTs the choice to
 * the worker's `POST /v1/profile/locale`. Presentational status states only.
 */
export function LocalePreferenceForm({
  apiUrl,
  currentLocale,
  locales,
  copy,
  getToken,
}: {
  apiUrl: string;
  currentLocale: string;
  locales: readonly { code: string; label: string }[];
  copy: LocalePreferenceCopy;
  getToken: () => Promise<string | null>;
}) {
  const [locale, setLocale] = useState(currentLocale);
  const [status, setStatus] = useState<Status>("idle");

  async function save() {
    setStatus("pending");
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/v1/profile/locale`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ locale }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-medium">{copy.heading}</h2>
        <p className="text-muted-foreground text-sm">{copy.description}</p>
      </div>
      <label className="block text-sm font-medium" htmlFor="locale-preference">
        {copy.label}
      </label>
      <select
        id="locale-preference"
        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
        value={locale}
        onChange={(e) => {
          setLocale(e.target.value);
          setStatus("idle");
        }}
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "pending"}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {status === "pending" ? copy.pending : copy.save}
        </button>
        {status === "success" ? <span className="text-sm text-green-600">{copy.success}</span> : null}
        {status === "error" ? <span className="text-destructive text-sm">{copy.error}</span> : null}
      </div>
    </section>
  );
}
```

Export it from the package the same way `NewsletterForm` is exported (add the line next to the existing form export in the `exports`/barrel; check `code/packages/web/ui-components/src/web/form/` neighbours for the exact re-export file).

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @indiecrafts/packages-web-ui-components test -- src/web/form/LocalePreferenceForm.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add code/packages/web/ui-components/src/web/form/LocalePreferenceForm.tsx code/packages/web/ui-components/src/web/form/LocalePreferenceForm.test.tsx code/packages/web/ui-components/src/web/**/index.ts
git commit -m "feat(ui-components): LocalePreferenceForm (Clerk-free language selector)"
```

---

### Task 5: Wire the three web surfaces (wrapper + settings page + messages)

**Files (per surface `S` in `website`, `app`, `admin`):**
- Create: `code/projects/web/surfaces/S/src/user-interface/.../LocalePreferencePanel.tsx` (thin client wrapper; place beside each surface's existing account/settings client components)
- Modify: the settings page — `website` + `app`: `src/app/[locale]/account/page.tsx`; `admin`: `src/app/[locale]/(dashboard)/settings/page.tsx`
- Modify: `code/projects/web/surfaces/S/messages/{en,fr}.json` (add the `account.locale.*` namespace)

**Interfaces:**
- Consumes: `LocalePreferenceForm`, `type LocalePreferenceCopy` from `@indiecrafts/packages-web-ui-components` (Task 4); `locales` from `@/config`; `useAuth` from `@indiecrafts/packages-web-auth` (or `@clerk/nextjs`).
- Produces: nothing downstream (leaf integration).

- [ ] **Step 1: Add the message keys (all three surfaces, both locales)**

Add to each surface's `messages/en.json` under `account`:

```json
"locale": {
  "heading": "Language",
  "description": "Choose the language we use for emails and this account.",
  "label": "Language",
  "save": "Save",
  "pending": "Saving…",
  "success": "Saved",
  "error": "Something went wrong. Please try again."
}
```

And `messages/fr.json`:

```json
"locale": {
  "heading": "Langue",
  "description": "Choisissez la langue de vos e-mails et de ce compte.",
  "label": "Langue",
  "save": "Enregistrer",
  "pending": "Enregistrement…",
  "success": "Enregistré",
  "error": "Une erreur est survenue. Veuillez réessayer."
}
```

> For `admin`, if its settings copy is namespaced under `settings` rather than `account`, nest the block under that namespace and read it with the matching `getTranslations` namespace in Step 3.

- [ ] **Step 2: Create the client wrapper (per surface)**

The wrapper is identical across surfaces except the `useRouter` import resolves to each surface's own `@/i18n/routing`. Create `LocalePreferencePanel.tsx`:

```tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "@/i18n/routing";
import {
  LocalePreferenceForm,
  type LocalePreferenceCopy,
} from "@indiecrafts/packages-web-ui-components";

/**
 * Client wrapper around the shared LocalePreferenceForm — supplies Clerk's getToken
 * and refreshes the route after a save so the new language takes effect. Copy +
 * current locale are resolved server-side by the settings page. Mirrors AccountDeletePanel.
 */
export function LocalePreferencePanel({
  copy,
  currentLocale,
  locales,
}: {
  copy: LocalePreferenceCopy;
  currentLocale: string;
  locales: readonly { code: string; label: string }[];
}) {
  const { getToken } = useAuth();
  const router = useRouter();
  return (
    <LocalePreferenceForm
      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
      currentLocale={currentLocale}
      locales={locales}
      copy={copy}
      getToken={async () => {
        const t = await getToken();
        return t;
      }}
    />
  );
}
```

> `router` is imported for parity with `AccountDeletePanel`; if a surface does not need a post-save refresh, drop the `useRouter` line and its import in that surface's copy.

- [ ] **Step 3: Render it in each settings page (gated)**

In each settings page (server component), resolve copy + locales and render the panel behind the same gate the delete/export sections use — Clerk configured + `NEXT_PUBLIC_API_URL` set. Example for `website`/`app` `account/page.tsx`:

```tsx
// (imports) add:
import { locales } from "@/config";
import { LocalePreferencePanel } from "@/user-interface/account/LocalePreferencePanel";
import type { LocalePreferenceCopy } from "@indiecrafts/packages-web-ui-components";

// inside the component, after the existing copy blocks:
const lt = await getTranslations({ locale, namespace: "account.locale" });
const localeCopy: LocalePreferenceCopy = {
  heading: lt("heading"),
  description: lt("description"),
  label: lt("label"),
  save: lt("save"),
  pending: lt("pending"),
  success: lt("success"),
  error: lt("error"),
};

// in the returned JSX (only when the api origin + Clerk are configured — the page
// already 404s without them for the delete section, so no extra guard is needed):
<LocalePreferencePanel
  copy={localeCopy}
  currentLocale={locale}
  locales={locales.map((l) => ({ code: l.code, label: l.label }))}
/>
```

For `admin`, add the same `<LocalePreferencePanel>` to `(dashboard)/settings/page.tsx` (read the `settings.locale`/`account.locale` namespace per Step 1) beside the existing settings form; the admin dashboard layout already enforces auth.

- [ ] **Step 4: Type-check the surfaces**

Run: `pnpm --filter @indiecrafts/web-surfaces-website tsc && pnpm --filter @indiecrafts/web-surfaces-app tsc && pnpm --filter @indiecrafts/web-surfaces-admin tsc`
Expected: PASS.

- [ ] **Step 5: Verify messages parity**

Run: `pnpm verify:quick` (lint + tsc), and confirm each surface's `en.json`/`fr.json` carry the same `account.locale.*` keys (the i18n check fails on a missing key).
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add code/projects/web/surfaces/*/src/user-interface code/projects/web/surfaces/*/src/app code/projects/web/surfaces/*/messages
git commit -m "feat(surfaces): profile language selector on website, app, admin settings"
```

---

## Self-Review

**1. Spec coverage**

- Data / populate `user_profiles.locale` → Task 2 (detect, COALESCE) + Task 1 (explicit write). ✓
- Adjust endpoint `POST /v1/profile/locale` → Task 1. ✓
- Read hook `getProfileLocale` → Task 1. ✓
- Email recipient-locale precedence (profile → captured → default) → Task 3 (`resolveLocale` + senders routed through it; worker-send seam documented). ✓
- Surface UI on all three web surfaces (shared component, messages, gating) → Tasks 4 + 5. ✓
- COALESCE decision (detect never overwrites explicit) → Task 2 upsert + test. ✓
- Non-goals honored: no migration (Task 1/2 use the existing column); owner-alerts untouched (Task 3 changes only confirmation senders); mobile/hybrid excluded (Task 5 covers the three web surfaces). ✓

**2. Placeholder scan** — no TBD/TODO; every code step carries real code; the only "future" note (worker-sent authed email) explicitly ships no code by design (YAGNI), per the spec.

**3. Type consistency** — `getProfileLocale(env, userId)`, `handleProfileLocale(request, env, ctx?, authenticate?)`, `resolveLocale(...candidates)`, `LocalePreferenceForm` props, and `LocalePreferenceCopy` are named identically wherever referenced across Tasks 1, 3, 4, 5. `logSession` gains `locale?: string | null`; `<SessionLogger>` gains `locale?: string`.

## Open items carried from the spec (confirm during execution)

- Message namespace: `account.locale.*` (admin may nest under `settings.*`) — Step 1/3 of Task 5.
- Selector pre-fill: the active request `locale` (no read endpoint) — Task 5 Step 3.
- Component home: `@indiecrafts/packages-web-ui-components` — Task 4.
