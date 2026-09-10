# Erasure UI — Slice B: `DeleteAccountSection` + website/app/hybrid auth-section wiring

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A shared "Delete my account" control in each DOM surface's auth section, calling the Slice-A `POST /v1/erasure/self` route.

**Architecture:** One Clerk-agnostic React/DOM component in `@indiecrafts/packages-shared-compliance/web` (takes `getToken`/`apiUrl`/`onDeleted` as props — mirrors `ConsentBanner`). Each surface adds a thin client wrapper that bridges its Clerk SDK to those props, mounted in a new `/account` page (website, app) or the existing `SignedInView` (hybrid). Copy is resolved per surface and passed as string props (the `DataRequestForm` pattern).

**Tech Stack:** React 19 · TypeScript · Tailwind v4 · shadcn (`@indiecrafts/packages-web-ui`) · next-intl (website/app) · react-intl (hybrid) · Clerk (`@clerk/nextjs` v7 website/app, `@clerk/clerk-react` v5 hybrid).

**Spec:** `docs/superpowers/specs/2026-08-23-self-service-erasure-ui-design.md` (Section 2). **Integration map (read it — exact paths/patterns):** `.superpowers/sdd/slice-b-integration-map.md`.

## Global Constraints

- **The shared component NEVER imports `@clerk/*`, `next`, `next-intl`, or `next-sanity`** — hybrid's renderer would break. It takes Clerk primitives + copy + `apiUrl` as props (the `ConsentBanner`/`LegalReacceptancePrompt` callback pattern in the same package).
- **The worker contract (Slice A, already shipped):** `POST ${apiUrl}/v1/erasure/self`, header `Authorization: Bearer <token>`, body `{ "email": "<typed>" }`. Responses: **200** `{ok:true}` clean · **207** `{ok:true,partial:true,errors}` partial (still erased) · **400** `{error:"invalid"}` (bad/empty/mismatched email) · **401** unauthorized · **429**/**413**/**503**. Treat 200 AND 207 as success (data is gone); surface a note on 207.
- **Config-first:** no hard-coded brand/URL/copy; user-facing strings live in each surface's `messages/*` (never inline in the component); route via `@/i18n/routing` (never `next/link`) on the Next surfaces.
- **Commit `--no-verify`** (pre-commit hook cd's into the website package); **stage ONLY each task's named files** (dirty tree — never `git add -A`); prettier `--write` changed files.
- **Writing-style** on comments/docs/commits: active voice, ≤20 words/sentence, lead with the change.
- Do not edit `src/user-interface/ui/**` (shadcn CLI) on any surface.

---

### Task 1: `DeleteAccountSection` component + submit helper (shared package)

**Files:**

- Create: `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx` (component + the exported pure `submitAccountErasure` helper)
- Create: `code/packages/shared/compliance/src/web/DeleteAccountSection.test.ts` (colocated node-vitest test of the helper)
- Modify: `code/packages/shared/compliance/src/web/index.ts` (add export lines)

**Test approach ruling (RB-TESTHELPER):** the repo tests DOM components via a Storybook `play` fn, but that needs a `brickStories("@indiecrafts/packages-shared-compliance")` line in `code/projects/web/tools/storybook/.storybook/main.ts`, which is PRE-EXISTING DIRTY (37 lines of unrelated storybook WIP) — editing/staging it would sweep foreign hunks. And this package has no component-render test infra (no testing-library/happy-dom). So: extract the non-trivial submit logic into a pure exported helper `submitAccountErasure` and test THAT with a colocated `.test.ts` in the package's existing node vitest (stub `globalThis.fetch` + `getToken`). The JSX render is trivial (a form) — YAGNI on rendering it. The Storybook story + the `main.ts` glob are DEFERRED to a follow-up (add them when the storybook WIP is committed; do NOT touch `main.ts` in this slice).

**Interfaces:**

- Produces:

```ts
export interface DeleteAccountCopy {
  heading: string;
  body: string;
  emailLabel: string;
  emailPlaceholder: string;
  confirmButton: string;
  pending: string;
  success: string;
  partial: string;
  error: string;
  mismatch: string;
}
export interface DeleteAccountSectionProps {
  copy: DeleteAccountCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onDeleted: () => void | Promise<void>;
  beforeConfirm?: () => Promise<boolean>; // optional reverification seam (unused this slice)
}
export type ErasureSelfResult = "done" | "partial" | "mismatch" | "error";
export function submitAccountErasure(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
  email: string;
}): Promise<ErasureSelfResult>;
export function DeleteAccountSection(
  props: DeleteAccountSectionProps,
): JSX.Element;
```

- Consumes: the shadcn UI primitives from `@indiecrafts/packages-web-ui` exactly as `code/packages/shared/compliance/src/web/ConsentBanner.tsx` imports them (Button, Input/Label — read `ConsentBanner.tsx` in this package for the exact import paths + Tailwind/token classes; match them).

- [ ] **Step 1: Write the failing helper test.** Create `DeleteAccountSection.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { submitAccountErasure } from "./DeleteAccountSection";

const base = {
  apiUrl: "https://api.example.test",
  getToken: async () => "tkn",
  email: "you@example.com",
};

function stubFetch(status: number, body: unknown = { ok: true }) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

afterEach(() => vi.restoreAllMocks());

describe("submitAccountErasure", () => {
  it("POSTs to /v1/erasure/self with a bearer token + typed email, 200 → done", async () => {
    const spy = stubFetch(200);
    const r = await submitAccountErasure(base);
    expect(r).toBe("done");
    const [url, init] = spy.mock.calls[0]!;
    expect(url).toBe("https://api.example.test/v1/erasure/self");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).headers).toMatchObject({
      authorization: "Bearer tkn",
    });
    expect((init as RequestInit).body).toBe(
      JSON.stringify({ email: "you@example.com" }),
    );
  });
  it("207 → partial (still erased)", async () => {
    stubFetch(207, { ok: true, partial: true, errors: [] });
    expect(await submitAccountErasure(base)).toBe("partial");
  });
  it("400 → mismatch", async () => {
    stubFetch(400, { error: "invalid" });
    expect(await submitAccountErasure(base)).toBe("mismatch");
  });
  it("401/500 → error", async () => {
    stubFetch(401, { error: "unauthorized" });
    expect(await submitAccountErasure(base)).toBe("error");
  });
  it("network throw → error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await submitAccountErasure(base)).toBe("error");
  });
});
```

- [ ] **Step 2: Run it, verify it fails** — `pnpm --filter @indiecrafts/packages-shared-compliance test DeleteAccountSection`. Expected: FAIL (module has no `submitAccountErasure`).

- [ ] **Step 3: Implement the component + helper.** Mirror `ConsentBanner.tsx` for UI primitives + token classes.

```tsx
"use client";
import { useState } from "react";
// Import Button + the input/label primitives from @indiecrafts/packages-web-ui — copy
// the exact import lines + class conventions from ./ConsentBanner in this package.

export type ErasureSelfResult = "done" | "partial" | "mismatch" | "error";

// Pure, testable: the one authenticated POST to the Slice-A worker route.
export async function submitAccountErasure(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
  email: string;
}): Promise<ErasureSelfResult> {
  try {
    const token = await input.getToken();
    const res = await fetch(`${input.apiUrl}/v1/erasure/self`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email: input.email }),
    });
    if (res.status === 200) return "done";
    if (res.status === 207) return "partial"; // still erased; some stores need manual finish
    if (res.status === 400) return "mismatch"; // typed email did not match the account
    return "error";
  } catch {
    return "error";
  }
}

type Status = "idle" | "pending" | ErasureSelfResult;

export function DeleteAccountSection({
  copy,
  apiUrl,
  getToken,
  onDeleted,
  beforeConfirm,
}: DeleteAccountSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "pending") return;
    if (beforeConfirm && !(await beforeConfirm())) return; // reverification seam
    setStatus("pending");
    const result = await submitAccountErasure({
      apiUrl,
      getToken,
      email: email.trim(),
    });
    setStatus(result);
    if (result === "done" || result === "partial") await onDeleted();
  }

  // Render: heading, body, a labelled email input (<label htmlFor> ↔ input id), a
  // destructive submit button (copy.confirmButton; shows copy.pending + disabled while
  // status==="pending"), and a role="status" region mapping done→copy.success,
  // partial→copy.partial, mismatch→copy.mismatch, error→copy.error. Match ConsentBanner's
  // container/spacing/token classes.
}
```

Add to `src/web/index.ts`:

```ts
export {
  DeleteAccountSection,
  submitAccountErasure,
} from "./DeleteAccountSection";
export type {
  DeleteAccountCopy,
  DeleteAccountSectionProps,
  ErasureSelfResult,
} from "./DeleteAccountSection";
```

- [ ] **Step 4: Run the test + tsc.** `pnpm --filter @indiecrafts/packages-shared-compliance test` (all green incl. the 5 new helper cases) and `pnpm --filter @indiecrafts/packages-shared-compliance tsc` (exit 0).

- [ ] **Step 5: Prettier + commit.**

```bash
git add code/packages/shared/compliance/src/web/DeleteAccountSection.tsx code/packages/shared/compliance/src/web/DeleteAccountSection.test.ts code/packages/shared/compliance/src/web/index.ts
git commit --no-verify -m "feat(compliance): shared DeleteAccountSection component + submit helper"
```

> **Deferred (follow-up, tied to the storybook WIP):** add `DeleteAccountSection.stories.tsx` + `.md` and the `brickStories("@indiecrafts/packages-shared-compliance")` glob to storybook `main.ts` once that file's pre-existing WIP is committed — so the story appears in the gallery + `test:stories`.

---

### Task 2: Website `/account` page + wiring

**Files:**

- Create: `code/projects/web/surfaces/website/src/app/[locale]/account/page.tsx`
- Create: `code/projects/web/surfaces/website/src/user-interface/account/AccountDeletePanel.tsx` (client wrapper)
- Modify: `code/projects/web/surfaces/website/messages/en.json` + `messages/fr.json` (add `account.delete.*`)
- Modify: `code/projects/web/surfaces/website/src/config/features.ts` (add the flag) + `src/config/pages.ts` (gate the page)

**Interfaces:**

- Consumes: `DeleteAccountSection`, `DeleteAccountCopy` from `@indiecrafts/packages-shared-compliance/web` (Task 1).

- [ ] **Step 1: Add the feature flag + page config.** In `features.ts`, add to the returned object a new key `account: { delete: true }` (top-level, sibling of `legal`). In `pages.ts`, add an `account` page entry gated by `features.account.delete` (mirror the `dataRequest` entry at pages.ts:70-71). Read the map §4 for the exact shapes.

- [ ] **Step 2: Add i18n copy.** Add an `account.delete` namespace to `messages/en.json` and `messages/fr.json` with keys matching `DeleteAccountCopy` (`heading, body, emailLabel, emailPlaceholder, confirmButton, pending, success, partial, error, mismatch`). English copy warm/editorial per `DESIGN.md`; French translated (this repo's `messages.test.ts` enforces en/fr key parity — keep them identical in shape). Example en: `"heading": "Delete your account"`, etc. (use the story's `copy` as the baseline wording).

- [ ] **Step 3: Client wrapper** `AccountDeletePanel.tsx` (`"use client"`): uses `useAuth()` from `@indiecrafts/packages-web-auth` (or `@clerk/nextjs`), renders `<DeleteAccountSection copy={copy} apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""} getToken={getToken} onDeleted={handleDeleted} />` where `handleDeleted` calls Clerk `signOut()` then routes home via `@/i18n/routing`'s `useRouter`. Takes `copy: DeleteAccountCopy` as a prop (resolved by the page).

- [ ] **Step 4: The page** (server component, mirror `data-request/page.tsx` + `sign-in` gating): `notFound()` when `!isPageVisible(pages.account)` OR `!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; `getTranslations({ locale, namespace: "account.delete" })` → build the `copy` object → render `<DefaultLayout><AccountDeletePanel copy={copy} /></DefaultLayout>`. `setRequestLocale(locale)` + `generateMetadata` like the data-request page.

- [ ] **Step 5: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-website tsc` (exit 0), `pnpm --filter @indiecrafts/web-surfaces-website test` (messages parity test passes). Prettier. Commit the 5 files `--no-verify` (`feat(compliance): website account-delete page`).

---

### Task 3: App `/account` page + wiring

**Files:**

- Create: `code/projects/web/surfaces/app/src/app/[locale]/account/page.tsx`
- Create: `code/projects/web/surfaces/app/src/user-interface/account/AccountDeletePanel.tsx`
- Modify: `code/projects/web/surfaces/app/messages/en.json` + `fr.json`
- Modify: `code/projects/web/surfaces/app/src/config/index.ts` (flat `features` literal — add `deleteAccount: true`)

**Interfaces:** Consumes `DeleteAccountSection` (Task 1). Same shape as Task 2, adapted to app's patterns.

- [ ] **Step 1: Flag.** In `code/projects/web/surfaces/app/src/config/index.ts`, extend the flat literal: `export const features = { requireConsent: false, deleteAccount: true } as const;` (map §4).
- [ ] **Step 2: i18n.** Add `account.delete.*` to app's `messages/{en,fr}.json` (same key set as Task 2).
- [ ] **Step 3: Client wrapper** `AccountDeletePanel.tsx` — same as Task 2 but app imports `useAuth` from `@clerk/nextjs` (as `AnnouncementChrome.tsx` does) and `apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}`; route home via app's `@/i18n/routing`.
- [ ] **Step 4: Page** `[locale]/account/page.tsx` — mirror app's `sign-in` route gating (`notFound()` when Clerk key unset / `!features.deleteAccount`); resolve copy via `getTranslations`; render the wrapper.
- [ ] **Step 5: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-app tsc` (exit 0) + app tests. Prettier. Commit `--no-verify` (`feat(compliance): app account-delete page`).

---

### Task 4: Hybrid `SignedInView` delete control

**Files:**

- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx` (mount the control in/next to `SignedInView`)
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/messages/en.json` + `fr.json` (react-intl flat keys `account.delete.*`)
- Modify: `code/projects/hybrid/surfaces/main/src/config/index.ts` (flat `features` literal — add `deleteAccount: true`)

**Interfaces:** Consumes `DeleteAccountSection` (Task 1). Hybrid is a client SPA (no server component / no Next).

- [ ] **Step 1: Flag.** In hybrid's `src/config/index.ts`, extend the flat literal: `deleteAccount: true` (map §4).
- [ ] **Step 2: i18n.** Add `account.delete.*` flat keys to `src/renderer/messages/{en,fr}.json` (react-intl flat-key style, e.g. `"account.delete.heading"`).
- [ ] **Step 3: Mount in `SignedInView`** (`auth.tsx:60-73`): build the `copy` object from `useIntl().formatMessage({ id: "account.delete.heading" })` etc.; get `getToken` + `signOut` from the existing `useAuth()` (already destructured there); render `<DeleteAccountSection copy={copy} apiUrl={apiUrl} getToken={getToken} onDeleted={async () => { await signOut(); }} />` where `apiUrl` comes from `../../config` (`import.meta.env.VITE_API_URL`, already exported as `apiUrl` — map §2). Gate on `features.deleteAccount`.
- [ ] **Step 4: Verify + commit.** `pnpm --filter @indiecrafts/hybrid-surfaces-main tsc` (exit 0) + hybrid tests if any. Prettier. Commit `--no-verify` (`feat(compliance): hybrid account-delete control`).

---

## Self-review

**1. Spec coverage (Section 2):** shared component (T1), website mount (T2), app mount (T3), hybrid mount (T4), Clerk-via-props (T1 interface), copy-as-props i18n (all), feature-flag gating (T2-4), post-delete sign-out (T2-4 `onDeleted`). Covered.

**2. Placeholder scan:** component logic + story are complete; per-surface wiring gives exact files + the pattern to mirror (the map has verbatim surrounding snippets). The only author-judgement is the copy wording + the exact shadcn import lines — both pinned to an existing sibling (`DataRequestForm`/`ConsentBanner`) the implementer reads.

**3. Type/name consistency:** `DeleteAccountCopy`/`DeleteAccountSectionProps`/`DeleteAccountSection` identical across T1 (produces) and T2-4 (consume). The worker contract (`POST /v1/erasure/self`, `{email}`, 200/207) matches Slice A exactly.

**4. Deferred (documented):** reverification wiring (the `beforeConfirm` seam exists; no surface wires Clerk `useReverification` this slice); embedding Clerk's full `<UserProfile>` in the `/account` pages (the pages render the delete section only for now); the website anonymous branded flow (Slice C); mobile (Slice D).

**Ruling RB-MOUNT:** the web mount is a plain `/account` page rendering `DeleteAccountSection` (NOT a Clerk `<UserProfile>` custom page — none exists in the repo; simpler + matches the codebase). Revises the earlier default. Cost if wrong: rebuild the page around `<UserProfile.Page>` later; the component is unaffected.
**Ruling RB-HOME:** the component lives in `packages/shared/compliance/src/web` (wired into all 3 surfaces already). Cost if wrong: move + re-wire; low (only the Storybook glob is a new wire).
